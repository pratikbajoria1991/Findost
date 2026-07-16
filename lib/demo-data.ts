/**
 * Demo portfolio for guest mode — a realistic Indian retail investor profile.
 * All values are illustrative and clearly labelled as demo data in the UI.
 */

export interface Holding {
  name: string;
  ticker?: string;
  category: string;
  invested: number;
  current: number;
  dayChangePct?: number;
  sipAmount?: number;
}

export interface AssetClass {
  key: string;
  label: string;
  value: number;
  color: string;
}

export const investorProfile = {
  name: "Guest Investor",
  age: 34,
  riskProfile: "Moderately Aggressive",
  monthlyIncome: 1_85_000,
  monthlySip: 45_000,
};

export const mutualFunds: Holding[] = [
  { name: "Parag Parikh Flexi Cap Fund (Direct-G)", category: "Flexi Cap", invested: 6_40_000, current: 9_12_400, sipAmount: 15_000 },
  { name: "HDFC Index Fund — Nifty 50 (Direct-G)", category: "Index", invested: 4_80_000, current: 6_31_200, sipAmount: 10_000 },
  { name: "Axis Midcap Fund (Direct-G)", category: "Mid Cap", invested: 3_60_000, current: 4_82_900, sipAmount: 8_000 },
  { name: "SBI Small Cap Fund (Direct-G)", category: "Small Cap", invested: 2_88_000, current: 4_10_600, sipAmount: 7_000 },
  { name: "ICICI Pru Balanced Advantage (Direct-G)", category: "Hybrid", invested: 2_40_000, current: 2_86_300, sipAmount: 5_000 },
];

export const stocks: Holding[] = [
  { name: "Reliance Industries", ticker: "RELIANCE", category: "Energy / Conglomerate", invested: 2_96_000, current: 3_64_800, dayChangePct: 0.84 },
  { name: "HDFC Bank", ticker: "HDFCBANK", category: "Banking", invested: 2_55_000, current: 2_98_350, dayChangePct: -0.32 },
  { name: "Tata Consultancy Services", ticker: "TCS", category: "IT Services", invested: 2_10_000, current: 2_26_800, dayChangePct: 0.41 },
  { name: "ITC", ticker: "ITC", category: "FMCG", invested: 1_24_000, current: 1_72_360, dayChangePct: 1.12 },
  { name: "Tata Motors", ticker: "TATAMOTORS", category: "Auto", invested: 98_000, current: 1_41_120, dayChangePct: -1.05 },
];

export const fixedIncome: Holding[] = [
  { name: "HDFC Bank Fixed Deposit (7.1%)", category: "FD — matures Mar 2027", invested: 8_00_000, current: 8_86_400 },
  { name: "EPF (Employee Provident Fund)", category: "Retirement", invested: 9_20_000, current: 11_64_000 },
  { name: "PPF (Public Provident Fund)", category: "Tax-free, 80C", invested: 4_50_000, current: 5_61_000 },
];

export const gold: Holding[] = [
  { name: "Sovereign Gold Bonds 2021-22 Sr-V", category: "SGB (2.5% + price)", invested: 2_40_000, current: 4_08_000 },
  { name: "Nippon India Gold ETF", category: "Gold ETF", invested: 90_000, current: 1_32_300 },
];

export function totals() {
  const sum = (h: Holding[]) => ({
    invested: h.reduce((a, b) => a + b.invested, 0),
    current: h.reduce((a, b) => a + b.current, 0),
  });
  const mf = sum(mutualFunds);
  const eq = sum(stocks);
  const fi = sum(fixedIncome);
  const au = sum(gold);
  const cash = 3_20_000;
  const invested = mf.invested + eq.invested + fi.invested + au.invested + cash;
  const current = mf.current + eq.current + fi.current + au.current + cash;
  return { mf, eq, fi, au, cash, invested, current, gain: current - invested };
}

export function allocation(): AssetClass[] {
  const t = totals();
  return [
    { key: "mf", label: "Mutual Funds", value: t.mf.current, color: "#2D9CFF" },
    { key: "eq", label: "Direct Equity", value: t.eq.current, color: "#5F29EA" },
    { key: "fi", label: "Fixed Income", value: t.fi.current, color: "#2BD98B" },
    { key: "au", label: "Gold", value: t.au.current, color: "#F2B544" },
    { key: "cash", label: "Cash", value: t.cash, color: "#64789A" },
  ];
}

/** Indicative market snapshot for demo mode (not live data). */
export const marketSnapshot = {
  asOf: "Demo data — indicative levels, not live quotes",
  indices: [
    { name: "NIFTY 50", level: "26,184", changePct: 0.62 },
    { name: "SENSEX", level: "85,912", changePct: 0.58 },
    { name: "NIFTY BANK", level: "57,460", changePct: -0.21 },
    { name: "NIFTY MIDCAP 150", level: "23,318", changePct: 1.04 },
    { name: "INDIA VIX", level: "12.84", changePct: -3.10 },
    { name: "USD / INR", level: "87.42", changePct: 0.08 },
  ],
  watchlist: [
    { ticker: "RELIANCE", price: "₹1,536", changePct: 0.84 },
    { ticker: "HDFCBANK", price: "₹1,118", changePct: -0.32 },
    { ticker: "TCS", price: "₹3,610", changePct: 0.41 },
    { ticker: "INFY", price: "₹1,742", changePct: 0.66 },
    { ticker: "ITC", price: "₹438", changePct: 1.12 },
    { ticker: "TATAMOTORS", price: "₹782", changePct: -1.05 },
  ],
};

export const presetGoals = [
  { key: "retirement", label: "Retirement at 55", target: 6_00_00_000, years: 21, icon: "🌅" },
  { key: "house", label: "Home down-payment", target: 40_00_000, years: 5, icon: "🏠" },
  { key: "education", label: "Child's education", target: 80_00_000, years: 15, icon: "🎓" },
  { key: "car", label: "Car upgrade", target: 18_00_000, years: 3, icon: "🚗" },
];
