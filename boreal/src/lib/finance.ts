/**
 * Financial helpers for the Boreal simulator.
 *
 * IMPORTANT (business rule): the displayed "à partir de 3 %" rate is an
 * indicative starting point, never a guarantee. These functions only produce
 * *illustrative* estimates. No offer, approval or contract is implied.
 */

export const MIN_ANNUAL_RATE = 3; // "à partir de 3 %" — sous réserve d'admissibilité

export interface SimulationInput {
  /** Principal borrowed, in CAD. */
  amount: number;
  /** Term in months. */
  months: number;
  /** Nominal annual interest rate, in percent (e.g. 3 for 3%). */
  annualRate: number;
}

export interface SimulationResult {
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
}

/**
 * Standard amortized (annuity) monthly payment.
 * M = P * r / (1 - (1 + r)^-n), with r the monthly rate.
 */
export function computeSimulation({
  amount,
  months,
  annualRate,
}: SimulationInput): SimulationResult {
  const safeAmount = Math.max(0, amount);
  const safeMonths = Math.max(1, Math.round(months));
  const monthlyRate = annualRate / 100 / 12;

  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = safeAmount / safeMonths;
  } else {
    monthlyPayment =
      (safeAmount * monthlyRate) /
      (1 - Math.pow(1 + monthlyRate, -safeMonths));
  }

  const totalPaid = monthlyPayment * safeMonths;
  const totalInterest = totalPaid - safeAmount;

  return {
    monthlyPayment: round2(monthlyPayment),
    totalPaid: round2(totalPaid),
    totalInterest: round2(Math.max(0, totalInterest)),
  };
}

export interface AmortizationRow {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

/** Full amortization schedule, one row per month. */
export function buildSchedule({
  amount,
  months,
  annualRate,
}: SimulationInput): AmortizationRow[] {
  const { monthlyPayment } = computeSimulation({ amount, months, annualRate });
  const monthlyRate = annualRate / 100 / 12;
  const safeMonths = Math.max(1, Math.round(months));

  const rows: AmortizationRow[] = [];
  let balance = Math.max(0, amount);

  for (let period = 1; period <= safeMonths; period++) {
    const interest = round2(balance * monthlyRate);
    let principal = round2(monthlyPayment - interest);
    if (period === safeMonths) {
      // Absorb rounding drift into the final payment.
      principal = round2(balance);
    }
    balance = round2(Math.max(0, balance - principal));
    rows.push({
      period,
      payment: round2(principal + interest),
      principal,
      interest,
      balance,
    });
  }

  return rows;
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
