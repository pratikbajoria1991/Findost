import { knowledgeReply } from "@/lib/knowledge";
import { demoReply, DEMO_FALLBACK_MARKER, type ChatMessage } from "@/lib/demo-advisor";
import { detectScriptLang, isLang, UI, type Lang } from "@/lib/i18n";

export const runtime = "nodejs";

/**
 * PaisaGuru chat. Answers come from two local engines — no external AI API:
 *   1. Training library (content/training/*.md) — curated NISM-grade material
 *      with sections in English + 10 Indian languages.
 *   2. Portfolio engine (lib/demo-advisor.ts) — computed answers about the
 *      user's portfolio, SIP/goal maths, retirement and tax.
 */

function textStream(reply: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const chunks = reply.match(/.{1,6}/gs) ?? [];
  return new ReadableStream({
    async start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
        // gentle pacing so answers read like a live assistant typing
        await new Promise((r) => setTimeout(r, 6));
      }
      controller.close();
    },
  });
}

export async function POST(req: Request) {
  let messages: ChatMessage[];
  let lang: Lang = "en";
  try {
    const body = await req.json();
    if (isLang(body.lang)) lang = body.lang;
    messages = (body.messages ?? []).filter(
      (m: ChatMessage) =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    );
    if (messages.length === 0) throw new Error("empty");
  } catch {
    return Response.json({ error: "messages[] required" }, { status: 400 });
  }

  const query = messages[messages.length - 1].content;

  // If the user typed in an Indic script while the selector is English,
  // answer in the typed language.
  if (lang === "en") {
    const detected = detectScriptLang(query);
    if (detected) lang = detected;
  }

  const trained = knowledgeReply(query, lang);
  let reply: string;
  let mode: string;
  if (trained) {
    reply = trained;
    mode = "trained";
  } else {
    reply = demoReply(messages);
    mode = "demo";
    // The portfolio engine speaks English; when it has no real answer and
    // the user is in another language, fall back in their language.
    if (lang !== "en" && reply.startsWith(DEMO_FALLBACK_MARKER)) {
      reply = UI[lang].fallback;
    }
  }

  return new Response(textStream(reply), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Findost-Mode": mode,
    },
  });
}
