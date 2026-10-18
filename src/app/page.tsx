import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileText,
  LayoutDashboard,
  ListFilter,
  Mail,
  Search,
  Settings2,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

const navigation = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Applications", icon: BriefcaseBusiness },
  { label: "Candidates", icon: Users },
  { label: "Interviews", icon: CalendarDays },
  { label: "Documents", icon: FileText },
];

const applications = [
  {
    company: "Northstar",
    initials: "N",
    color: "bg-violet-100 text-violet-700",
    role: "Senior Product Designer",
    location: "Remote · United States",
    date: "Today",
    status: "Interview",
    statusStyle: "bg-emerald-50 text-emerald-700",
  },
  {
    company: "Linear",
    initials: "L",
    color: "bg-slate-900 text-white",
    role: "Product Designer",
    location: "New York, NY",
    date: "Yesterday",
    status: "In review",
    statusStyle: "bg-blue-50 text-blue-700",
  },
  {
    company: "Acme Studio",
    initials: "A",
    color: "bg-amber-100 text-amber-800",
    role: "Design Lead",
    location: "Remote · North America",
    date: "Oct 14",
    status: "Applied",
    statusStyle: "bg-slate-100 text-slate-600",
  },
  {
    company: "Orbit",
    initials: "O",
    color: "bg-cyan-100 text-cyan-800",
    role: "Staff Product Designer",
    location: "San Francisco, CA",
    date: "Oct 12",
    status: "Draft",
    statusStyle: "bg-amber-50 text-amber-700",
  },
];

const stats = [
  {
    label: "Active applications",
    value: "12",
    detail: "Across 8 companies",
    icon: BriefcaseBusiness,
    trend: "+3 this month",
    direction: "up",
  },
  {
    label: "Interviews",
    value: "03",
    detail: "Next one in 2 days",
    icon: CalendarDays,
    trend: "+1 this week",
    direction: "up",
  },
  {
    label: "Response rate",
    value: "24%",
    detail: "Your last 30 days",
    icon: Mail,
    trend: "4% vs last month",
    direction: "down",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[248px] flex-col border-r border-slate-200/80 bg-white lg:flex">
        <div className="flex h-[76px] items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold tracking-tight text-white shadow-sm shadow-indigo-200">
            q
          </div>
          <span className="text-[17px] font-semibold tracking-tight text-slate-900">
            qts<span className="text-indigo-600">.</span>
          </span>
          <span className="ml-auto rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Beta
          </span>
        </div>

        <div className="px-4 pt-6">
          <button
            className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left shadow-sm"
            type="button"
            disabled
            aria-label="Current workspace: Personal workspace"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-100 text-xs font-semibold text-amber-800">
              A
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-800">
                Personal workspace
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">Manager</p>
            </div>
            <ChevronDown className="size-4 text-slate-400" />
          </button>
        </div>

        <nav aria-label="Main navigation" className="px-3 pt-7">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
            Workspace
          </p>
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  aria-current={item.active ? "page" : undefined}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition ${
                    item.active
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                  disabled={!item.active}
                  key={item.label}
                  title={
                    item.active
                      ? item.label
                      : "This section will be available in a later phase"
                  }
                  type="button"
                >
                  <Icon className="size-[17px]" strokeWidth={1.8} />
                  <span className="flex-1">{item.label}</span>
                  {item.label === "Applications" && (
                    <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                      12
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="mt-auto px-3 pb-5">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
            Preferences
          </p>
          <button
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-slate-500"
            disabled
            title="Settings will be available in a later phase"
            type="button"
          >
            <Settings2 className="size-[17px]" strokeWidth={1.8} />
            Settings
          </button>
          <button
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-slate-500"
            disabled
            title="Help will be available in a later phase"
            type="button"
          >
            <CircleHelp className="size-[17px]" strokeWidth={1.8} />
            Help center
          </button>
          <div className="mt-5 rounded-xl bg-slate-50 p-3.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Zap className="size-3.5 text-indigo-600" />
              Application assistant
            </div>
            <p className="mt-1.5 text-[11px] leading-4 text-slate-500">
              The browser extension is planned for a later phase.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
              <span className="size-1.5 rounded-full bg-amber-400" />
              Not connected
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-10 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
              q
            </div>
            <span className="text-base font-semibold tracking-tight">
              qts<span className="text-indigo-600">.</span>
            </span>
          </div>
          <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
            <span>Workspace</span>
            <ChevronRight className="size-3.5" />
            <span className="font-medium text-slate-700">Overview</span>
          </div>
          <div className="ml-auto flex items-center gap-3 sm:gap-4">
            <label className="hidden h-9 w-[220px] items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 md:flex">
              <Search className="size-4 text-slate-400" />
              <input
                aria-label="Search"
                className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
                disabled
                placeholder="Search jobs..."
              />
              <span className="rounded border border-slate-200 bg-white px-1 py-0.5 text-[9px] font-medium text-slate-400">
                /
              </span>
            </label>
            <button
              aria-label="Notifications"
              className="relative flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
              disabled
              type="button"
            >
              <Bell className="size-[18px]" strokeWidth={1.8} />
              <span className="absolute right-[8px] top-[7px] size-1.5 rounded-full bg-indigo-500 ring-2 ring-white" />
            </button>
            <div className="h-7 w-px bg-slate-200" />
            <button
              aria-label="Account menu for Alex Morgan"
              className="flex items-center gap-2"
              disabled
              type="button"
            >
              <div className="flex size-8 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-semibold text-indigo-700">
                AM
              </div>
              <span className="hidden text-xs font-medium text-slate-700 sm:inline">
                Alex Morgan
              </span>
              <ChevronDown className="hidden size-3.5 text-slate-400 sm:inline" />
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 sm:py-10">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <p className="text-xs font-medium text-slate-400">
                  Sunday, October 18, 2026
                </p>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-700">
                  Sample dashboard
                </span>
              </div>
              <h1 className="text-[26px] font-semibold tracking-[-0.04em] text-slate-900 sm:text-[30px]">
                Good morning, Alex
              </h1>
              <p className="mt-1 text-[13px] text-slate-500">
                Here&apos;s what&apos;s happening with your job search.
              </p>
            </div>
            <button
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-xs font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled
              title="Job creation will be available in a later phase"
              type="button"
            >
              <span className="text-base leading-none">+</span>
              Add a job
            </button>
          </div>

          <section aria-label="Application summary" className="grid gap-4 md:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const TrendIcon =
                stat.direction === "up" ? ArrowUpRight : ArrowDownRight;
              return (
                <article
                  className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
                  key={stat.label}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        {stat.label}
                      </p>
                      <p className="mt-3 text-[28px] font-semibold tracking-[-0.05em] text-slate-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <Icon className="size-[17px]" strokeWidth={1.8} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                    <p className="text-[11px] text-slate-400">{stat.detail}</p>
                    <span
                      className={`inline-flex items-center gap-0.5 text-[10px] font-medium ${
                        stat.direction === "up"
                          ? "text-emerald-600"
                          : "text-slate-500"
                      }`}
                    >
                      <TrendIcon className="size-3" />
                      {stat.trend}
                    </span>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="mt-7 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
            <article className="min-w-0 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
                <div>
                  <h2 className="text-sm font-semibold tracking-tight text-slate-800">
                    Recent applications
                  </h2>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Your latest job application activity
                  </p>
                </div>
                <button
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-[11px] font-medium text-slate-500"
                  disabled
                  title="Filters will be available in a later phase"
                  type="button"
                >
                  <ListFilter className="size-3.5" />
                  Filter
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left sm:min-w-[640px]">
                  <thead>
                    <tr className="bg-slate-50/70 text-[10px] font-medium uppercase tracking-[0.11em] text-slate-400">
                      <th className="px-6 py-3">Role</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="hidden px-4 py-3 sm:table-cell">
                        Date added
                      </th>
                      <th className="hidden px-4 py-3 text-right sm:table-cell">
                        More
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((application) => (
                      <tr
                        className="border-t border-slate-100"
                        key={`${application.company}-${application.role}`}
                      >
                        <td className="px-4 py-3.5 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${application.color}`}
                            >
                              {application.initials}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-800">
                                {application.role}
                              </p>
                              <p className="mt-1 text-[10px] text-slate-400">
                                {application.company}{" "}
                                <span className="px-0.5">·</span>{" "}
                                {application.location}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-3.5 sm:px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${application.statusStyle}`}
                          >
                            <span className="size-1.5 rounded-full bg-current opacity-70" />
                            {application.status}
                          </span>
                        </td>
                        <td className="hidden px-4 py-3.5 text-[11px] text-slate-500 sm:table-cell">
                          {application.date}
                        </td>
                        <td className="hidden px-4 py-3.5 text-right sm:table-cell">
                          <button
                            aria-label={`More actions for ${application.role} at ${application.company}`}
                            className="rounded-md p-1.5 text-slate-400"
                            disabled
                            type="button"
                          >
                            <span className="sr-only">More actions</span>
                            <span aria-hidden="true">•••</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3.5">
                <p className="text-[10px] text-slate-400">
                  Showing 4 of 12 applications
                </p>
                <button
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600"
                  disabled
                  title="Application list will be available in a later phase"
                  type="button"
                >
                  View all <ChevronRight className="size-3.5" />
                </button>
              </div>
            </article>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
              <article className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <CalendarDays className="size-3.5" />
                    </div>
                    Coming up
                  </div>
                  <button
                    aria-label="More interview actions"
                    className="text-slate-400"
                    disabled
                    type="button"
                  >
                    <span aria-hidden="true">•••</span>
                  </button>
                </div>
                <div className="mt-5 rounded-lg border border-indigo-100 bg-indigo-50/60 p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600">
                      Wednesday
                    </span>
                    <span className="text-[10px] font-medium text-indigo-500">
                      Oct 21
                    </span>
                  </div>
                  <p className="mt-2.5 text-xs font-semibold text-slate-800">
                    Product design interview
                  </p>
                  <p className="mt-1 text-[10px] text-slate-500">
                    Northstar · 10:30 AM
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 border-t border-indigo-100 pt-2.5 text-[10px] text-slate-500">
                    <Clock3 className="size-3" />
                    In 2 days
                  </div>
                </div>
                <p className="mt-3 text-center text-[10px] text-slate-400">
                  Sample interview data
                </p>
              </article>

              <article className="relative overflow-hidden rounded-xl bg-slate-900 p-5 text-white shadow-[0_4px_12px_rgba(15,23,42,0.12)]">
                <div className="absolute -right-8 -top-10 size-36 rounded-full bg-indigo-500/20 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <Sparkles className="size-4 text-indigo-300" />
                    AI workspace
                  </div>
                  <p className="mt-3 text-sm font-semibold tracking-tight">
                    Your tools, in sync.
                  </p>
                  <p className="mt-1.5 text-[11px] leading-5 text-slate-300">
                    Gemini will help with application questions. ChatGPT will
                    generate resumes and cover letters.
                  </p>
                  <div className="mt-4 space-y-2 border-t border-white/10 pt-3">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-300">Gemini · answers</span>
                      <span className="text-amber-300">Setup needed</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-300">ChatGPT · documents</span>
                      <span className="text-amber-300">Setup needed</span>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <footer className="mt-6 flex flex-wrap items-center justify-between gap-2 px-1 text-[10px] text-slate-400">
            <p>
              Preview only · Sample data is not connected to a database.
            </p>
            <p className="inline-flex items-center gap-1.5">
              <Check className="size-3 text-emerald-500" />
              Workspace foundation
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
