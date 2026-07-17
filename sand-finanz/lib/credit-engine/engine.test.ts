import { describe, expect, it } from "vitest";
import {
  applyRounding,
  buildSchedule,
  calculate,
  computeIndicativeApr,
  computeOriginationFee,
  monthlyPayment,
  validate,
} from "./engine";
import type { CreditProductVersion } from "./types";

const baseParams: CreditProductVersion = {
  id: "test",
  version: 1,
  country: "DE",
  productType: "personal",
  currency: "EUR",
  minAmount: 1_000,
  maxAmount: 50_000,
  minTerm: 6,
  maxTerm: 120,
  nominalRate: 0.06,
  originationFee: null,
  rounding: { unit: 0.01, mode: "nearest" },
  activeFrom: "2026-01-01",
  disclaimerKey: "calculator.disclaimer",
};

describe("monthlyPayment", () => {
  it("computes the standard amortising payment (P=10000, 6% nominal, 24m)", () => {
    // r = 0.005, expected ≈ 443.21
    const m = monthlyPayment(10_000, 0.06 / 12, 24);
    expect(m).toBeCloseTo(443.21, 2);
  });

  it("handles the zero-interest edge case with straight-line repayment", () => {
    expect(monthlyPayment(12_000, 0, 24)).toBe(500);
  });

  it("returns 0 for a non-positive term", () => {
    expect(monthlyPayment(10_000, 0.005, 0)).toBe(0);
  });
});

describe("applyRounding", () => {
  it("rounds to the nearest unit", () => {
    expect(applyRounding(443.214, { unit: 0.01, mode: "nearest" })).toBe(443.21);
    expect(applyRounding(443.216, { unit: 1, mode: "nearest" })).toBe(443);
  });
  it("rounds up and down", () => {
    expect(applyRounding(443.01, { unit: 1, mode: "up" })).toBe(444);
    expect(applyRounding(443.99, { unit: 1, mode: "down" })).toBe(443);
  });
});

describe("computeOriginationFee", () => {
  it("supports fixed and percentage fees", () => {
    expect(computeOriginationFee(10_000, { type: "fixed", value: 150 })).toBe(150);
    expect(computeOriginationFee(10_000, { type: "percent", value: 0.02 })).toBe(200);
    expect(computeOriginationFee(10_000, null)).toBe(0);
  });
});

describe("buildSchedule", () => {
  it("closes the balance at exactly zero on the final instalment", () => {
    const payment = monthlyPayment(10_000, 0.06 / 12, 24);
    const schedule = buildSchedule(10_000, 0.06 / 12, 24, payment);
    expect(schedule).toHaveLength(24);
    expect(schedule[23].balance).toBe(0);
    // Principal parts must sum back to the original principal.
    const totalPrincipal = schedule.reduce((s, r) => s + r.principal, 0);
    expect(totalPrincipal).toBeCloseTo(10_000, 1);
  });
});

describe("validate", () => {
  it("flags out-of-bounds amounts and terms", () => {
    expect(validate({ principal: 500, termMonths: 24 }, baseParams)[0].code).toBe("AMOUNT_TOO_LOW");
    expect(validate({ principal: 99_999, termMonths: 24 }, baseParams)[0].code).toBe(
      "AMOUNT_TOO_HIGH",
    );
    expect(validate({ principal: 10_000, termMonths: 3 }, baseParams)[0].code).toBe("TERM_TOO_SHORT");
    expect(validate({ principal: 10_000, termMonths: 999 }, baseParams)[0].code).toBe(
      "TERM_TOO_LONG",
    );
    expect(validate({ principal: 10_000, termMonths: 24 }, baseParams)).toHaveLength(0);
  });
});

describe("calculate", () => {
  it("produces a coherent result set", () => {
    const r = calculate({ principal: 10_000, termMonths: 24 }, baseParams);
    expect(r.monthlyPayment).toBeCloseTo(443.21, 2);
    expect(r.totalRepayment).toBeCloseTo(r.monthlyPayment * 24, 0);
    expect(r.totalInterest).toBeCloseTo(r.totalRepayment - 10_000, 2);
    expect(r.totalCost).toBeCloseTo(r.totalInterest, 2); // no fee
    expect(r.effectiveRateIsIndicative).toBe(true);
  });

  it("adds an origination fee to the total cost but not to the instalment", () => {
    const withFee = calculate(
      { principal: 10_000, termMonths: 24 },
      { ...baseParams, originationFee: { type: "fixed", value: 200 } },
    );
    expect(withFee.originationFee).toBe(200);
    expect(withFee.totalCost).toBeCloseTo(withFee.totalInterest + 200, 2);
  });

  it("uses a validated APR when provided instead of the indicative one", () => {
    const r = calculate(
      { principal: 10_000, termMonths: 24 },
      { ...baseParams, effectiveRate: 0.075 },
    );
    expect(r.effectiveRateIsIndicative).toBe(false);
    expect(r.effectiveRate).toBe(0.075);
  });

  it("throws on out-of-bounds input", () => {
    expect(() => calculate({ principal: 10, termMonths: 24 }, baseParams)).toThrow();
  });
});

describe("computeIndicativeApr", () => {
  it("recovers the nominal rate when there is no fee", () => {
    // With no fee, effective annual ≈ (1 + nominal/12)^12 - 1 > nominal.
    const payment = monthlyPayment(10_000, 0.06 / 12, 24);
    const apr = computeIndicativeApr(10_000, payment, 24);
    expect(apr).toBeCloseTo(Math.pow(1 + 0.06 / 12, 12) - 1, 4);
  });

  it("increases the APR when an upfront fee reduces the net received", () => {
    const payment = monthlyPayment(10_000, 0.06 / 12, 24);
    const aprNoFee = computeIndicativeApr(10_000, payment, 24);
    const aprWithFee = computeIndicativeApr(9_800, payment, 24);
    expect(aprWithFee).toBeGreaterThan(aprNoFee);
  });
});
