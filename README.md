# QTS Job Application Workspace

QTS is a job-application platform built with Next.js. The initial milestone
establishes the application shell and dashboard preview; the workflows and
integrations will be implemented in later phases.

## Current status

- Next.js App Router, TypeScript, and Tailwind CSS application scaffold.
- Responsive sign-in page and role-scoped dashboard connected to Neon.
- Server-only Neon connection helper and Users/Profiles/Categories/Login History schema.
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

Open <http://localhost:3000>. Sign in with the staff login name and password
configured for the initial Super Admin. Candidate Accounts cannot sign in.

## Environment variables

Set `DATABASE_URL` to a Neon PostgreSQL connection string and `AUTH_SECRET` to
a unique random value of at least 32 bytes in `.env.local`. The local
development secret is generated automatically when this project is set up.
For another environment, generate a separate secret and store it only in that
environment's secret store. Never reuse secrets between environments or commit
them.

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
- `educations` and `experiences`: repeatable education and work-history records
  owned by candidate profiles. Dates are optional month-precision dates stored
  on the first day of the month; current records cannot have an end date, and
  end dates cannot precede start dates.

`resume_pdf_id` is nullable and intentionally has no foreign key yet. The
resume-template table and its ownership/storage model are deferred, so no
candidate can be assigned a nonexistent template until that model is decided.

The database enforces the role hierarchy (Super Admin → Admin → Manager →
Account), makes staff login names and normalized candidate email addresses
unique, prevents changing a user's role, and only permits profiles for Account
users. Candidate Accounts have no login credentials. User records are retained;
blocking does not delete them.

Staff sign-in uses a signed, HTTP-only, seven-day session cookie and verifies
the user's active status against Neon on each request. Login errors do not
reveal whether a login name exists. Successful login history is retained for
the latest five sign-ins per staff user and is visible only to Super Admin.
Role-scoped dashboard queries show each staff member only their own branch of
the user hierarchy.

The Users page follows the same hierarchy: Super Admin creates Admins, Admins
create Managers, and Managers create candidate Accounts with draft profiles.
New Admin and Manager display names are assigned from their role, so their
creation form only asks for a username and password. The dashboard shows the
full display name and username rather than using an initial as the identity.
Candidate creation captures name, email, phone, headline, LinkedIn URL, country
name, city, province/state, one address line, postal code, and optional category
in one full-width form for Managers.
Staff can update their own display name and login name from Profile after
confirming their current password; they can optionally replace their password.
Only Super Admin can update another staff member's login name or password.
Super Admin can permanently delete Admin and Manager accounts. If an account
has direct reports, the reports must first be reassigned to another active
Admin or Manager peer at the same hierarchy level; the reassignment and
deletion happen atomically. Deletion is refused while blocking-audit references
remain and also removes that staff user's login history; it cannot be undone.
Password fields have a show/hide control while entering a password, but saved
passwords cannot be viewed because the database stores only one-way hashes.
Changing a password invalidates the user's existing sessions.
Staff passwords must contain at least four characters; longer passwords are
recommended for better security.

After adding `DATABASE_URL` to `.env.local`, apply the migration with
`npm run db:migrate`. This modifies the selected Neon database.

To create the one-time Super Admin, add these values to `.env.local` and run
`npm run db:seed:super-admin`:

```env
SUPER_ADMIN_DISPLAY_NAME="Super Admin"
SUPER_ADMIN_LOGIN_NAME="superadmin"
SUPER_ADMIN_PASSWORD="choose-a-unique-password"
```

The seed command hashes the password with scrypt, refuses to create a second
Super Admin, and never prints the password or hash. Sign in at
<http://localhost:3000/login> using that login name and password. Remove the
seed password from `.env.local` after the command succeeds. Do not commit real
environment values.

## Validation

```bash
npm run db:generate
npm run lint
npm run build
```

The attached `plan.md` is a product template, not a complete implementation
contract. Decisions that affect privacy, OAuth consent, schema, or submission
behavior must be finalized before implementing those features.
