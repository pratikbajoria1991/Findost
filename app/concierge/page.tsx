import type { Metadata } from "next";
import ConciergeApp from "@/components/ConciergeApp";

export const metadata: Metadata = {
  title: "Concierge — Findost",
};

export default function ConciergePage() {
  return <ConciergeApp />;
}
