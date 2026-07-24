import { sipRequired, sipFutureValue, inflate } from "./calculators";

/**
 * Findost Intelligence engine — turns user data into a specific product
 * recommendation. Pure functions, no external calls.
 *
 * Insurance logic follows the standard Indian needs-analysis method used by
 * Policybazaar and NISM material: Human Life Value / income-replacement for
 * term cover, city-tier + family sizing for health cover. All outputs are
 * educational and clearly indicative — real premiums come from insurers.
 */

// ── Insurance ───────────────────────────────────────────────────────────

export interface InsuranceInputs {
  age: number;
  gender: "male" | "female";
  smoker: boolean;
  annualIncome: number; // ₹/year
  dependents: number;
  outstandingLoans: number; // ₹
  existingLifeCover: number; // ₹
  existingHealthCover: number; // ₹
  cityTier: 1 | 2 | 3; // 1 = metro
  familyMembers: number; // people to cover under health
  eldestMemberAge: number;
}

export interface InsuranceResult {
  term: {
    recommendedCover: number;
    coverGap: number;
    incomeMultiple: number;
    termYears: number;
    indicativeAnnualPremium: [number, number]; // range
    rationale: string[];
  };
  health: {
    recommendedCover: number;
    baseCover: number;
    superTopUp: number;
    coverGap: number;
    rationale: string[];
  };
}

/** Age-scaled income multiple — younger earners need to replace more years. */
function incomeMultipleForAge(age: number): number {
  if (age < 35) return 20;
  if (age < 45) return 16;
  if (age < 55) return 12;
  return 8;
}

/** Indicative term premium ₹/year for a given cover, age and smoking status.
 *  Rough market calibration: ~₹11,000 per ₹1 crore per year for a healthy
 *  30-year-old non-smoker, rising with age, higher for smokers. Indicative only. */
function indicativeTermPremium(cover: number, age: number, smoker: boolean, gender: string): number {
  const crores = cover / 1_00_00_000;
  let ratePerCrore = 11_000 * Math.pow(1.06, Math.max(0, age - 30));
  if (smoker) ratePerCrore *= 1.5;
  if (gender === "female") ratePerCrore *= 0.9; // women typically priced lower
  return Math.round(crores * ratePerCrore);
}

export function recommendInsurance(i: InsuranceInputs): InsuranceResult {
  // ---- Term life (income-replacement / HLV) ----
  const multiple = incomeMultipleForAge(i.age);
  const grossNeed = multiple * i.annualIncome + i.outstandingLoans;
  const recommendedCover = Math.max(0, Math.round(grossNeed - i.existingLifeCover));
  const idealTotal = multiple * i.annualIncome + i.outstandingLoans;
  const termYears = Math.max(10, Math.min(40, 60 - i.age));
  const midPremium = indicativeTermPremium(
    recommendedCover || idealTotal,
    i.age,
    i.smoker,
    i.gender,
  );

  const termRationale: string[] = [
    `At ${i.age}, a healthy income-replacement multiple is ~${multiple}× your annual income.`,
    `${multiple} × ${inr(i.annualIncome)} income${
      i.outstandingLoans > 0 ? ` + ${inr(i.outstandingLoans)} loans` : ""
    } = ${inr(idealTotal)} of cover you should carry.`,
  ];
  if (i.existingLifeCover > 0) {
    termRationale.push(
      `You already hold ${inr(i.existingLifeCover)} — so you need about ${inr(
        recommendedCover,
      )} more.`,
    );
  }
  termRationale.push(
    `Buy it as a pure term plan till age 60 (${termYears} years). Choose an insurer with a 97%+ claim-settlement ratio and disclose health/smoking honestly.`,
  );

  // ---- Health cover (city tier + family sizing) ----
  const perAdultBase = i.cityTier === 1 ? 10_00_000 : i.cityTier === 2 ? 7_00_000 : 5_00_000;
  // Family floater: base for the family, loaded up if an elder member is present.
  let baseCover = perAdultBase;
  if (i.familyMembers >= 3) baseCover = Math.round(perAdultBase * 1.0); // floater shares one sum
  if (i.eldestMemberAge >= 45) baseCover = Math.round(baseCover * 1.5);
  baseCover = Math.min(baseCover, 15_00_000);
  // Super top-up multiplies total cover cheaply.
  const targetTotal = i.cityTier === 1 ? 50_00_000 : i.cityTier === 2 ? 30_00_000 : 20_00_000;
  const superTopUp = Math.max(0, targetTotal - baseCover);
  const recommendedHealth = baseCover + superTopUp;
  const healthGap = Math.max(0, recommendedHealth - i.existingHealthCover);

  const healthRationale: string[] = [
    `For a Tier-${i.cityTier} city and ${i.familyMembers} ${
      i.familyMembers === 1 ? "person" : "people"
    }, aim for about ${inr(recommendedHealth)} of total cover.`,
    `Structure it cost-efficiently: a ${inr(baseCover)} base policy${
      superTopUp > 0 ? ` + a ${inr(superTopUp)} super top-up` : ""
    } costs far less than one large policy.`,
  ];
  if (i.eldestMemberAge >= 45) {
    healthRationale.push(
      `A member is 45+, so hospital-bill inflation and room-rent limits matter — pick no room-rent capping and restoration benefit.`,
    );
  }
  if (i.existingHealthCover > 0 && healthGap > 0) {
    healthRationale.push(
      `You hold ${inr(i.existingHealthCover)} today — a super top-up is the cheapest way to close the ${inr(
        healthGap,
      )} gap.`,
    );
  }

  return {
    term: {
      recommendedCover,
      coverGap: recommendedCover,
      incomeMultiple: multiple,
      termYears,
      indicativeAnnualPremium: [Math.round(midPremium * 0.8), Math.round(midPremium * 1.2)],
      rationale: termRationale,
    },
    health: {
      recommendedCover: recommendedHealth,
      baseCover,
      superTopUp,
      coverGap: healthGap,
      rationale: healthRationale,
    },
  };
}

// ── Wealth ──────────────────────────────────────────────────────────────

export type Risk = "conservative" | "moderate" | "aggressive";

export interface WealthInputs {
  age: number;
  monthlyInvestable: number; // ₹/month surplus
  monthlyExpenses: number; // ₹/month
  risk: Risk;
  goalName: string;
  goalTargetToday: number; // ₹ in today's money
  goalYears: number;
  existingCorpus: number; // ₹ already invested
}

export interface WealthResult {
  equityPct: number;
  debtPct: number;
  goldPct: number;
  allocation: { label: string; pct: number; color: string; note: string }[];
  emergencyFundTarget: number;
  goal: {
    futureCost: number;
    sipNeeded: number;
    yourSipGrows: number;
    onTrack: boolean;
    shortfallSip: number;
  };
  productMix: string[];
  premiumNudge: string | null;
}

export function recommendWealth(w: WealthInputs): WealthResult {
  // Equity glide path: 110 − age, tilted by risk appetite.
  let equity = 110 - w.age;
  if (w.risk === "conservative") equity -= 15;
  if (w.risk === "aggressive") equity += 10;
  equity = Math.max(20, Math.min(85, Math.round(equity)));
  const gold = equity >= 60 ? 10 : 8;
  const debt = 100 - equity - gold;

  const expectedReturn = w.risk === "conservative" ? 9 : w.risk === "aggressive" ? 12.5 : 11;

  // Goal maths (inflation-adjusted). General inflation ~6%; education ~10%.
  const inflation = /educat/i.test(w.goalName) ? 10 : /home|house/i.test(w.goalName) ? 7 : 6;
  const futureCost = inflate(w.goalTargetToday, inflation, w.goalYears);
  const corpusGrows = sipFutureValue(0, expectedReturn, w.goalYears) + // placeholder 0 for SIP part
    w.existingCorpus * Math.pow(1 + expectedReturn / 100, w.goalYears);
  const remainingTarget = Math.max(0, futureCost - corpusGrows);
  const sipNeeded = Math.round(sipRequired(remainingTarget, expectedReturn, w.goalYears));
  const yourSipGrows = Math.round(sipFutureValue(w.monthlyInvestable, expectedReturn, w.goalYears)) +
    Math.round(w.existingCorpus * Math.pow(1 + expectedReturn / 100, w.goalYears));
  const onTrack = yourSipGrows >= futureCost;
  const shortfallSip = Math.max(0, sipNeeded - w.monthlyInvestable);

  const equitySplit = (() => {
    if (w.risk === "conservative")
      return "mostly a Nifty index fund + one flexi-cap; skip small-caps";
    if (w.risk === "aggressive")
      return "index + flexi-cap core, with a mid/small-cap booster (max 15–20%)";
    return "a Nifty index fund + a flexi-cap as the core, a small mid-cap tilt";
  })();

  const productMix: string[] = [
    `Equity ${equity}% — ${equitySplit}. Route it through monthly SIPs.`,
    `Debt ${debt}% — PPF/EPF for tax-free long-term money, plus a short-duration fund or FD for near-term needs.`,
    `Gold ${gold}% — Sovereign Gold Bonds (best) or a gold ETF, as an inflation hedge.`,
  ];
  if (w.age < 45)
    productMix.push(
      `Add NPS for the extra ₹50,000 tax deduction under 80CCD(1B) if you're in the old regime.`,
    );
  if (w.monthlyInvestable * 12 * w.goalYears > 50_00_000 && w.risk !== "conservative")
    productMix.push(
      `At your scale, a SIF (from ₹10L) can add downside protection via long-short strategies — ask PaisaGuru.`,
    );

  const emergencyFundTarget = w.monthlyExpenses * 6;

  const allocation = [
    { label: "Equity", pct: equity, color: "#2D9CFF", note: "growth engine" },
    { label: "Debt", pct: debt, color: "#2BD98B", note: "stability" },
    { label: "Gold", pct: gold, color: "#F2B544", note: "inflation hedge" },
  ];

  const premiumNudge =
    w.monthlyExpenses > 0
      ? `Before investing, make sure your emergency fund (${inr(
          emergencyFundTarget,
        )}) and term + health insurance are in place — protection comes first. Use the Insurance tab to size them.`
      : null;

  return {
    equityPct: equity,
    debtPct: debt,
    goldPct: gold,
    allocation,
    emergencyFundTarget,
    goal: { futureCost, sipNeeded, yourSipGrows, onTrack, shortfallSip },
    productMix,
    premiumNudge,
  };
}

// tiny local INR compact formatter (kept dependency-free for this module)
function inr(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_00_00_000) return `${sign}₹${(abs / 1_00_00_000).toFixed(2)} Cr`;
  if (abs >= 1_00_000) return `${sign}₹${(abs / 1_00_000).toFixed(1)} L`;
  if (abs >= 1_000) return `${sign}₹${(abs / 1_000).toFixed(0)}K`;
  return `${sign}₹${abs.toFixed(0)}`;
}
