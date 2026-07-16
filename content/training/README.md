# Findost Training Library

This folder **is** the concierge's brain. Every `.md` file here becomes knowledge the chatbot can answer from — no AI API involved. Add, edit or delete files and redeploy; the bot picks them up automatically.

## File format

```markdown
---
topic: What is a SIP and how does it work
keywords: sip, systematic investment plan, monthly investment, rupee cost averaging
---

The answer the concierge should give, written exactly as you want it
delivered to the user. Markdown supported: **bold**, bullets, numbered lists.
```

- **topic** — the question this file answers (used for matching and shown nowhere).
- **keywords** — comma-separated phrases users might type. More phrases = better matching. Hinglish phrases welcome (`paisa kahan lagaye`).
- **body** — your training material. Keep one concept per file; 10 small files beat 1 big one.

## Matching rules

The engine scores the user's question against every file (keyword phrase hits score highest, then topic words, then body words) and answers with the best file above a confidence threshold. If nothing matches, the built-in portfolio engine answers (portfolio review, SIP maths, retirement, tax, emergency fund), and finally a polite fallback.

## Language support (top 10 Indian languages)

Add translated answers inside the same file using `[lang]` markers after the
English body. Supported codes: `hi bn mr te ta gu ur kn or ml`.

```markdown
English answer here...

[hi]
**SIP क्या है?** हिंदी उत्तर...

[ta]
**SIP என்றால் என்ன?** தமிழ் பதில்...
```

Start each language section with a **bold localized heading** — the engine
uses it for matching questions typed in that language. When a user's selected
language (or typed script) has no section, the English answer is served. The
market-risk disclaimer is appended automatically in the user's language.

## Compliance note

Every answer automatically gets the market-risk disclaimer appended in the user's language — you don't need to add it in each file. Never write guaranteed-return language in training material.
