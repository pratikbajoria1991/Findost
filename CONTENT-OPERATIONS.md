# Findost daily content operating standard

## Objective

Publish one helpful, current and compliance-reviewed educational article each business day for Indian investors. Research signals identify genuine questions; they must never be copied or treated as investment recommendations.

## Daily workflow

1. Collect recurring questions from Google Search Console, AnswerThePublic, relevant public Reddit discussions, and X conversations. Respect each platform's terms and use approved APIs or licensed tools where required.
2. Select one intent with clear investor value. Do not publish a topic solely because it is trending.
3. Validate every number, regulation, tax rule, scheme feature and market statement against a primary source such as SEBI, AMFI, RBI, CBDT, PFRDA, an AMC factsheet or an official government notification.
4. Draft an original, plain-English answer with a direct answer at the top, decision context, risks, dates, source links and a clear educational disclaimer.
5. Obtain editorial and compliance approval before publication. Automated publication is prohibited for financial-content drafts.
6. Add front matter (`title`, `date`, `description`) in `content/blog/`, run `npm.cmd run build`, and publish through the normal Git/Vercel workflow.
7. Monitor Search Console impressions, click-through rate, engagement and support questions. Refresh content when rules or market facts change.

## Content guardrails

- No guaranteed returns, target prices, personalised advice or unverified performance claims.
- Never reproduce Reddit or X posts verbatim. Summarise the underlying question in original language.
- Treat platform signals as research inputs, not sources of fact.
- Keep author accountability visible: every article is published by the Findost Editorial Team and must show a publication date and disclaimer.

## Required access before automating research

- Google Search Console property/API access.
- A licensed AnswerThePublic export or API entitlement.
- Approved Reddit API credentials and an X API plan that permits the intended research use.
- A named compliance reviewer and documented approval record.
