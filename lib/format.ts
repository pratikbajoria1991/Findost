const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const inrPrecise = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export function formatINR(value: number, precise = false): string {
  return precise ? inrPrecise.format(value) : inr.format(value);
}

/** Compact Indian notation: 1.2 Cr, 45.3 L, 82 K */
export function formatINRCompact(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_00_00_000) return `${sign}₹${(abs / 1_00_00_000).toFixed(2)} Cr`;
  if (abs >= 1_00_000) return `${sign}₹${(abs / 1_00_000).toFixed(1)} L`;
  if (abs >= 1_000) return `${sign}₹${(abs / 1_000).toFixed(0)} K`;
  return `${sign}₹${abs.toFixed(0)}`;
}

export function formatPct(value: number, signed = true): string {
  const s = signed && value > 0 ? "+" : "";
  return `${s}${value.toFixed(2)}%`;
}
