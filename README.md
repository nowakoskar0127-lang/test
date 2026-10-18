# QTS Job Application Workspace

QTS is a job-application platform built with Next.js. The initial milestone
establishes the application shell and dashboard preview; the workflows and
integrations will be implemented in later phases.

## Current status

- Next.js App Router, TypeScript, and Tailwind CSS application scaffold.
- Responsive dashboard preview with clearly labeled sample data.
- Server-only Neon connection helper and initial Users/Profiles migration.
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

## Users and candidate profiles

The initial database schema contains:

- `users`: staff and candidate Account identities, role, immediate parent,
  staff display/login credentials, blocking metadata, and timestamps. Candidate
  names live only in their `profiles` row.
- `profiles`: one-to-one candidate details for Account users, with an optional
  category assignment and optional resume PDF template reference. Candidate
  fields are nullable so Managers can save drafts.
- `categories`: category names selectable on candidate profiles.

`resume_pdf_id` is nullable and intentionally has no foreign key yet. The
resume-template table and its ownership/storage model are deferred, so no
candidate can be assigned a nonexistent template until that model is decided.

The database enforces the role hierarchy (Super Admin → Admin → Manager →
Account), makes staff login names and normalized candidate email addresses
unique, prevents changing a user's role, and only permits profiles for Account
users. Candidate Accounts have no login credentials. User records are retained;
blocking does not delete them.

After adding `DATABASE_URL` to `.env.local`, apply the migration with
`npm run db:migrate`. This modifies the selected Neon database.

To create the one-time Super Admin, add these values to `.env.local` and run
`npm run db:seed:super-admin`:

```env
SUPER_ADMIN_DISPLAY_NAME="Super Admin"
SUPER_ADMIN_LOGIN_NAME="superadmin"
SUPER_ADMIN_PASSWORD="choose-a-unique-password-at-least-14-characters-long"
```

The seed command hashes the password with scrypt, refuses to create a second
Super Admin, and never prints the password or hash. Remove the seed password
from `.env.local` after the command succeeds. Do not commit real environment
values.

## Validation

```bash
npm run db:generate
npm run lint
npm run build
```

The attached `plan.md` is a product template, not a complete implementation
contract. Decisions that affect privacy, OAuth consent, schema, or submission
behavior must be finalized before implementing those features.
