# QTS Job Application Workspace

QTS is a job-application platform built with Next.js. The initial milestone
establishes the application shell and dashboard preview; the workflows and
integrations will be implemented in later phases.

## Current status

- Next.js App Router, TypeScript, and Tailwind CSS application scaffold.
- Responsive dashboard preview with clearly labeled sample data.
- Server-only Neon connection helper; no schema or migrations have been applied.
- Gmail mailbox OAuth is deferred until the candidate-consent flow is defined.
- AI integrations and the browser extension are not connected yet.

Planned AI responsibilities:

- OpenAI/ChatGPT: tailored resumes and cover letters only.
- Gemini: instructions and answers for application questions only.
- API keys must remain server-side and must never use a `NEXT_PUBLIC_` prefix.

Manual application mode will leave Next/Submit to the Manager after review.
Auto mode is planned to generate documents, discover and fill supported form
fields, advance through the application, submit only under the agreed safety
checks, and save an application only after submission success is confirmed.
Email verification links will be shown to the Manager to review and open.

## Local development

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open <http://localhost:3000>. The dashboard currently uses sample data and does
not require environment variables.

## Environment variables

Set `DATABASE_URL` to a Neon PostgreSQL connection string before using the
server-side database helper in `src/lib/db.ts`. Keep real credentials in
`.env.local` or a deployment secret store; never commit them.

`OPENAI_API_KEY` and `GEMINI_API_KEY` are reserved for their respective
server-side integrations and are not used by the current dashboard.

## Validation

```bash
npm run lint
npm run build
```

The attached `plan.md` is a product template, not a complete implementation
contract. Decisions that affect privacy, OAuth consent, schema, or submission
behavior must be finalized before implementing those features.
