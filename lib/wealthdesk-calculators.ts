/**
 * The full "Wealth Desk" calculator suite — SIP, Lumpsum, FD, EMI, Tax,
 * Retirement, Goal, PPF, NPS. Formulas ported 1:1 from the original Findost
 * static-site build (findost.io) so results stay consistent for returning
 * users; UI is rebuilt natively for this app.
 */

export interface CalcField {
  key: string;
  label: string;
  default: number;
  min: number;
  max: number;
  step: number;
  suffix?: string; // e.g. "%", "years" — display only
}

export interface CalcResultRow {
  label: string;
  value: number;
}

export interface CalcResult {
  headline: number;
  headlineLabel: string;
  rows: CalcResultRow[];
}

export interface CalculatorConfig {
  key: string;
  kicker: string;
  title: string;
  fields: CalcField[];
  calculate: (values: Record<string, number>) => CalcResult;
}

function result(headline: number, headlineLabel: string, rows: [string, number][]): CalcResult {
  return { headline, headlineLabel, rows: rows.map(([label, value]) => ({ label, value })) };
}

export const CALCULATORS: CalculatorConfig[] = [
  {
    key: "sip",
    kicker: "SIP calculator",
    title: "Plan your monthly SIP corpus",
    fields: [
      { key: "monthly", label: "Monthly SIP (₹)", default: 12000, min: 500, max: 1_000_000, step: 500 },
      { key: "rate", label: "Expected annual return (%)", default: 12, min: 1, max: 30, step: 0.5 },
      { key: "years", label: "Time horizon (years)", default: 15, min: 1, max: 40, step: 1 },
    ],
    calculate(v) {
      const monthlyRate = v.rate / 100 / 12;
      const months = v.years * 12;
      const invested = v.monthly * months;
      const corpus =
        monthlyRate === 0
          ? invested
          : v.monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      return result(corpus, "Estimated SIP maturity value", [
        ["Invested amount", invested],
        ["Estimated gains", corpus - invested],
        ["Monthly habit", v.monthly],
      ]);
    },
  },
  {
    key: "lumpsum",
    kicker: "Lumpsum calculator",
    title: "Estimate one-time investment growth",
    fields: [
      { key: "amount", label: "Investment amount (₹)", default: 500000, min: 1000, max: 10_000_000, step: 1000 },
      { key: "rate", label: "Expected annual return (%)", default: 11, min: 1, max: 30, step: 0.5 },
      { key: "years", label: "Time horizon (years)", default: 10, min: 1, max: 40, step: 1 },
    ],
    calculate(v) {
      const corpus = v.amount * Math.pow(1 + v.rate / 100, v.years);
      return result(corpus, "Estimated future value after compounding", [
        ["Invested amount", v.amount],
        ["Estimated gains", corpus - v.amount],
        ["Years invested", v.years],
      ]);
    },
  },
  {
    key: "fd",
    kicker: "FD calculator",
    title: "Compare fixed deposit maturity",
    fields: [
      { key: "principal", label: "Deposit amount (₹)", default: 300000, min: 1000, max: 10_000_000, step: 1000 },
      { key: "rate", label: "Annual interest rate (%)", default: 7.2, min: 1, max: 12, step: 0.1 },
      { key: "years", label: "Tenure (years)", default: 3, min: 1, max: 10, step: 0.5 },
      { key: "frequency", label: "Compounding per year", default: 4, min: 1, max: 12, step: 1 },
    ],
    calculate(v) {
      const maturity = v.principal * Math.pow(1 + v.rate / 100 / v.frequency, v.frequency * v.years);
      return result(maturity, "Estimated FD maturity value", [
        ["Deposit amount", v.principal],
        ["Interest earned", maturity - v.principal],
        ["Compounding", v.frequency],
      ]);
    },
  },
  {
    key: "emi",
    kicker: "EMI calculator",
    title: "Understand loan monthly outflow",
    fields: [
      { key: "principal", label: "Loan amount (₹)", default: 2_500_000, min: 10_000, max: 50_000_000, step: 10_000 },
      { key: "rate", label: "Annual interest rate (%)", default: 8.75, min: 1, max: 24, step: 0.1 },
      { key: "years", label: "Loan tenure (years)", default: 15, min: 1, max: 30, step: 1 },
    ],
    calculate(v) {
      const monthlyRate = v.rate / 100 / 12;
      const months = v.years * 12;
      const emi =
        monthlyRate === 0
          ? v.principal / months
          : (v.principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
            (Math.pow(1 + monthlyRate, months) - 1);
      const total = emi * months;
      return result(emi, "Estimated monthly EMI", [
        ["Total repayment", total],
        ["Interest paid", total - v.principal],
        ["Loan tenure (months)", months],
      ]);
    },
  },
  {
    key: "tax",
    kicker: "Income tax calculator",
    title: "Simplified new-regime tax estimate",
    fields: [
      { key: "income", label: "Annual income (₹)", default: 1_200_000, min: 0, max: 100_000_000, step: 10_000 },
      { key: "deduction", label: "Standard deduction (₹)", default: 75000, min: 0, max: 1_000_000, step: 1000 },
    ],
    calculate(v) {
      const taxable = Math.max(0, v.income - v.deduction);
      const slabs: [number, number][] = [
        [400000, 0],
        [800000, 0.05],
        [1200000, 0.1],
        [1600000, 0.15],
        [2000000, 0.2],
        [2400000, 0.25],
        [Infinity, 0.3],
      ];
      let previous = 0;
      let tax = 0;
      for (const [limit, rate] of slabs) {
        if (taxable > previous) {
          tax += Math.max(0, Math.min(taxable, limit) - previous) * rate;
          previous = limit;
        }
      }
      const rebate = taxable <= 1_200_000 ? tax : 0;
      const finalTax = Math.max(0, tax - rebate) * 1.04; // + 4% cess
      return result(finalTax, "Simplified tax + cess estimate", [
        ["Taxable income", taxable],
        ["Rebate (Sec 87A)", rebate],
        ["Tax before cess", Math.max(0, tax - rebate)],
      ]);
    },
  },
  {
    key: "retirement",
    kicker: "Retirement calculator",
    title: "Estimate retirement corpus need",
    fields: [
      { key: "expense", label: "Current monthly expense (₹)", default: 80000, min: 5000, max: 2_000_000, step: 1000 },
      { key: "inflation", label: "Inflation (%)", default: 6, min: 1, max: 12, step: 0.5 },
      { key: "yearsToRetire", label: "Years to retirement", default: 25, min: 1, max: 45, step: 1 },
      { key: "retirementYears", label: "Years after retirement", default: 25, min: 5, max: 40, step: 1 },
    ],
    calculate(v) {
      const inflatedMonthly = v.expense * Math.pow(1 + v.inflation / 100, v.yearsToRetire);
      const corpus = inflatedMonthly * 12 * v.retirementYears;
      return result(corpus, "Rough retirement corpus (pre post-retirement returns)", [
        ["Future monthly expense", inflatedMonthly],
        ["Retirement years covered", v.retirementYears],
        ["Inflation assumption (%)", v.inflation],
      ]);
    },
  },
  {
    key: "goal",
    kicker: "Goal calculator",
    title: "Work backward from a future target",
    fields: [
      { key: "target", label: "Goal amount today (₹)", default: 2_500_000, min: 10_000, max: 100_000_000, step: 10_000 },
      { key: "inflation", label: "Inflation (%)", default: 6, min: 1, max: 12, step: 0.5 },
      { key: "returnRate", label: "Expected return (%)", default: 11, min: 1, max: 30, step: 0.5 },
      { key: "years", label: "Years to goal", default: 10, min: 1, max: 35, step: 1 },
    ],
    calculate(v) {
      const futureGoal = v.target * Math.pow(1 + v.inflation / 100, v.years);
      const monthlyRate = v.returnRate / 100 / 12;
      const months = v.years * 12;
      const sip =
        (futureGoal * monthlyRate) / ((Math.pow(1 + monthlyRate, months) - 1) * (1 + monthlyRate));
      return result(sip, "Estimated monthly SIP needed", [
        ["Inflated goal value", futureGoal],
        ["Goal today", v.target],
        ["Years available", v.years],
      ]);
    },
  },
  {
    key: "ppf",
    kicker: "PPF calculator",
    title: "Project long-term PPF maturity",
    fields: [
      { key: "yearly", label: "Annual contribution (₹)", default: 150000, min: 500, max: 150000, step: 500 },
      { key: "rate", label: "Interest rate (%)", default: 7.1, min: 1, max: 12, step: 0.1 },
      { key: "years", label: "Tenure (years)", default: 15, min: 15, max: 35, step: 1 },
    ],
    calculate(v) {
      let balance = 0;
      for (let year = 0; year < v.years; year += 1) {
        balance = (balance + v.yearly) * (1 + v.rate / 100);
      }
      const contributed = v.yearly * v.years;
      return result(balance, "Estimated PPF maturity value", [
        ["Total contribution", contributed],
        ["Estimated interest", balance - contributed],
        ["Tenure (years)", v.years],
      ]);
    },
  },
  {
    key: "nps",
    kicker: "NPS calculator",
    title: "Estimate NPS retirement corpus",
    fields: [
      { key: "monthly", label: "Monthly contribution (₹)", default: 10000, min: 500, max: 1_000_000, step: 500 },
      { key: "rate", label: "Expected annual return (%)", default: 10, min: 1, max: 20, step: 0.5 },
      { key: "years", label: "Years to retirement", default: 25, min: 1, max: 40, step: 1 },
      { key: "annuity", label: "Annuity allocation (%)", default: 40, min: 40, max: 100, step: 5 },
    ],
    calculate(v) {
      const monthlyRate = v.rate / 100 / 12;
      const months = v.years * 12;
      const corpus =
        v.monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      return result(corpus, "Estimated NPS corpus at retirement", [
        ["Lumpsum portion", corpus * (1 - v.annuity / 100)],
        ["Annuity portion", corpus * (v.annuity / 100)],
        ["Total contribution", v.monthly * months],
      ]);
    },
  },
];

export function getCalculator(key: string): CalculatorConfig | undefined {
  return CALCULATORS.find((c) => c.key === key);
}
