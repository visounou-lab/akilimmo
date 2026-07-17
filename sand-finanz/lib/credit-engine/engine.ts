import type {
  AmortizationRow,
  CalculationInput,
  CalculationResult,
  CreditProductVersion,
  OriginationFee,
  RoundingRule,
  ValidationError,
} from "./types";

/** Applies a rounding rule to a monetary amount. */
export function applyRounding(amount: number, rule: RoundingRule): number {
  if (rule.unit <= 0) return amount;
  const q = amount / rule.unit;
  const rounded =
    rule.mode === "up" ? Math.ceil(q) : rule.mode === "down" ? Math.floor(q) : Math.round(q);
  // Guard against binary-float drift (e.g. 4.999999 * 100).
  return Math.round(rounded * rule.unit * 1e6) / 1e6;
}

export function computeOriginationFee(principal: number, fee: OriginationFee | null): number {
  if (!fee) return 0;
  const raw = fee.type === "fixed" ? fee.value : principal * fee.value;
  return Math.round(raw * 100) / 100;
}

/**
 * Constant monthly payment for an amortising loan:
 *
 *   M = P · r · (1 + r)^n / ((1 + r)^n − 1)
 *
 * where P = principal, r = monthly rate, n = number of monthly instalments.
 * Handles the r = 0 edge case (straight-line repayment).
 */
export function monthlyPayment(principal: number, monthlyRate: number, termMonths: number): number {
  if (termMonths <= 0) return 0;
  if (monthlyRate === 0) return principal / termMonths;
  const factor = Math.pow(1 + monthlyRate, termMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
}

/** Builds the full amortisation schedule from an (unrounded) monthly payment. */
export function buildSchedule(
  principal: number,
  monthlyRate: number,
  termMonths: number,
  payment: number,
): AmortizationRow[] {
  const rows: AmortizationRow[] = [];
  let balance = principal;
  for (let month = 1; month <= termMonths; month++) {
    const interest = balance * monthlyRate;
    let principalPart = payment - interest;
    // Final instalment absorbs rounding drift so the balance closes at zero.
    if (month === termMonths) principalPart = balance;
    balance = Math.max(0, balance - principalPart);
    rows.push({
      month,
      payment: round2(interest + principalPart),
      interest: round2(interest),
      principal: round2(principalPart),
      balance: round2(balance),
    });
  }
  return rows;
}

/**
 * Indicative effective annual rate (APR / TAEG) derived from the cash flows.
 * The borrower receives (principal − upfront fee) and repays `payment` for
 * `termMonths`. Solved with Newton–Raphson on the monthly rate, then annualised.
 *
 * This is an INDICATIVE figure. A validated APR must be entered on the product
 * version (`effectiveRate`) following the legally applicable method.
 */
export function computeIndicativeApr(
  netReceived: number,
  payment: number,
  termMonths: number,
): number {
  if (netReceived <= 0 || payment <= 0 || termMonths <= 0) return 0;
  // PV(rate) = payment · (1 − (1+rate)^-n) / rate − netReceived
  let rate = 0.01; // 1 %/month starting guess
  for (let i = 0; i < 100; i++) {
    const pow = Math.pow(1 + rate, -termMonths);
    const pv = rate === 0 ? payment * termMonths : (payment * (1 - pow)) / rate;
    const f = pv - netReceived;
    // Derivative of PV w.r.t. rate.
    const dpow = -termMonths * Math.pow(1 + rate, -termMonths - 1);
    const dpv = (payment * (-dpow * rate - (1 - pow))) / (rate * rate);
    if (Math.abs(dpv) < 1e-12) break;
    const next = rate - f / dpv;
    if (!Number.isFinite(next) || next <= -0.9999) break;
    if (Math.abs(next - rate) < 1e-10) {
      rate = next;
      break;
    }
    rate = next;
  }
  // Annualise the effective monthly rate.
  return Math.pow(1 + rate, 12) - 1;
}

export function validate(
  input: CalculationInput,
  params: CreditProductVersion,
): ValidationError[] {
  const errors: ValidationError[] = [];
  const { principal, termMonths } = input;
  if (!Number.isFinite(principal)) {
    errors.push({ code: "INVALID_NUMBER", field: "principal" });
  } else {
    if (principal < params.minAmount)
      errors.push({ code: "AMOUNT_TOO_LOW", field: "principal", limit: params.minAmount });
    if (principal > params.maxAmount)
      errors.push({ code: "AMOUNT_TOO_HIGH", field: "principal", limit: params.maxAmount });
  }
  if (!Number.isFinite(termMonths)) {
    errors.push({ code: "INVALID_NUMBER", field: "termMonths" });
  } else {
    if (termMonths < params.minTerm)
      errors.push({ code: "TERM_TOO_SHORT", field: "termMonths", limit: params.minTerm });
    if (termMonths > params.maxTerm)
      errors.push({ code: "TERM_TOO_LONG", field: "termMonths", limit: params.maxTerm });
  }
  return errors;
}

/**
 * Full calculation. Throws if the input is out of the product bounds — callers
 * should run {@link validate} first for user-facing messaging.
 */
export function calculate(
  input: CalculationInput,
  params: CreditProductVersion,
): CalculationResult {
  const errors = validate(input, params);
  if (errors.length > 0) {
    throw new Error(`Invalid calculation input: ${errors.map((e) => e.code).join(", ")}`);
  }

  const { principal, termMonths } = input;
  const monthlyRate = params.nominalRate / 12;
  const rawPayment = monthlyPayment(principal, monthlyRate, termMonths);
  const displayedPayment = applyRounding(rawPayment, params.rounding);

  const schedule = buildSchedule(principal, monthlyRate, termMonths, rawPayment);
  const totalRepayment = round2(schedule.reduce((sum, r) => sum + r.payment, 0));
  const totalInterest = round2(totalRepayment - principal);
  const originationFee = computeOriginationFee(principal, params.originationFee);
  const totalCost = round2(totalInterest + originationFee);

  const effectiveRateIsIndicative = params.effectiveRate == null;
  const effectiveRate = effectiveRateIsIndicative
    ? computeIndicativeApr(principal - originationFee, rawPayment, termMonths)
    : (params.effectiveRate as number);

  return {
    currency: params.currency,
    principal,
    termMonths,
    nominalRate: params.nominalRate,
    effectiveRate,
    effectiveRateIsIndicative,
    monthlyPayment: displayedPayment,
    originationFee,
    totalInterest,
    totalRepayment,
    totalCost,
    schedule,
    disclaimerKey: params.disclaimerKey,
  };
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
