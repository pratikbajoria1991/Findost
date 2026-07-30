/**
 * Airtable CRM — every lead (Google sign-in, callback form, Wealth Check
 * intake, WhatsApp click) lands as a row in your Airtable base.
 *
 * Env vars: AIRTABLE_API_KEY (personal access token with data.records:write),
 * AIRTABLE_BASE_ID (appXXXX), AIRTABLE_TABLE (default "Leads").
 * Without them the capture becomes a console log so the site never breaks.
 */

export interface Lead {
  name?: string;
  email?: string;
  phone?: string;
  source: string; // "google-signin" | "callback-form" | "wealth-check" | ...
  message?: string;
  // Optional Wealth Check intake fields (from the "Start a wealth check" form)
  city?: string;
  clientType?: string;
  serviceNeed?: string;
  mandate?: string;
}

export async function captureLead(lead: Lead): Promise<boolean> {
  const key = process.env.AIRTABLE_API_KEY;
  const base = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_TABLE || "Leads";

  if (!key || !base) {
    console.log("[lead] Airtable not configured — lead:", JSON.stringify(lead));
    return false;
  }

  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${base}/${encodeURIComponent(table)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          records: [
            {
              fields: {
                Name: lead.name ?? "",
                Email: lead.email ?? "",
                Phone: lead.phone ?? "",
                Source: lead.source,
                Message: lead.message ?? "",
                City: lead.city ?? "",
                "Client Type": lead.clientType ?? "",
                "Service Need": lead.serviceNeed ?? "",
                Mandate: lead.mandate ?? "",
                "Captured At": new Date().toISOString(),
              },
            },
          ],
          typecast: true,
        }),
      },
    );
    if (!res.ok) {
      console.error("[lead] Airtable error", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[lead] Airtable request failed", err);
    return false;
  }
}
