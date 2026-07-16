/**
 * Goal-planning math. Monthly compounding, inflation-adjusted targets.
 */

/** Future value of a monthly SIP at annual return r% for n years. */
export function sipFutureValue(monthly: number, annualReturnPct: number, years: number): number {
  const i = annualReturnPct / 100 / 12;
  const n = years * 12;
  if (i === 0) return monthly * n;
  return monthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
}

/** Monthly SIP needed to reach a target at annual return r% over n years. */
export function sipRequired(target: number, annualReturnPct: number, years: number): number {
  const i = annualReturnPct / 100 / 12;
  const n = years * 12;
  if (i === 0) return target / n;
  return target / (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
}

/** Inflate today's cost to a future value at inflation g% over n years. */
export function inflate(todayCost: number, inflationPct: number, years: number): number {
  return todayCost * Math.pow(1 + inflationPct / 100, years);
}

/** Lump-sum future value. */
export function lumpsumFutureValue(principal: number, annualReturnPct: number, years: number): number {
  return principal * Math.pow(1 + annualReturnPct / 100, years);
}
