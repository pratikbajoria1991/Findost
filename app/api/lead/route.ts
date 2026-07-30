import { captureLead } from "@/lib/airtable";

export const runtime = "nodejs";

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Lead-capture endpoint → Airtable CRM. Handles both the simple callback
 *  form and the richer Wealth Check intake (source: "wealth-check"). */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  // Honeypot field — bots fill it, humans never see it.
  if (typeof body.company === "string" && body.company.length > 0) {
    return Response.json({ ok: true });
  }

  const name = str(body.name, 120);
  const phone = str(body.phone, 20);
  const email = str(body.email, 160);
  const message = str(body.message, 500);
  const city = str(body.city, 80);
  const clientType = str(body.clientType, 60);
  const serviceNeed = str(body.serviceNeed, 80);
  const mandate = str(body.mandate, 800);
  const source = str(body.source, 40) || "callback-form";

  if (!name || (!phone && !email)) {
    return Response.json(
      { ok: false, error: "name and phone or email required" },
      { status: 400 },
    );
  }

  await captureLead({ name, phone, email, message, city, clientType, serviceNeed, mandate, source });
  return Response.json({ ok: true });
}
