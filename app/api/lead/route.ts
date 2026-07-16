import { captureLead } from "@/lib/airtable";

export const runtime = "nodejs";

/** Lead-capture endpoint → Airtable CRM. */
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

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
  const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 20) : "";
  const email = typeof body.email === "string" ? body.email.trim().slice(0, 160) : "";
  const message = typeof body.message === "string" ? body.message.trim().slice(0, 500) : "";

  if (!name || (!phone && !email)) {
    return Response.json(
      { ok: false, error: "name and phone or email required" },
      { status: 400 },
    );
  }

  await captureLead({ name, phone, email, message, source: "callback-form" });
  return Response.json({ ok: true });
}
