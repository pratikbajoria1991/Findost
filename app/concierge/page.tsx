import type { Metadata } from "next";
import ConciergeApp from "@/components/ConciergeApp";

export const metadata: Metadata = {
  title: "PaisaGuru AI Wealth Desk for Indian Investors | Findost",
  description:
    "Use Findost’s PaisaGuru AI Wealth Desk for portfolio clarity, financial calculators, market context and advisory-safe wealth planning in India.",
};

export default function ConciergePage() {
  return <ConciergeApp />;
}
