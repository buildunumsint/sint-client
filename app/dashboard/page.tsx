"use client";
import { useAuthContext } from "@/context/AuthContext";
import { useStatsContext } from "@/context/prefetch/StatsContext";
import { CalendarDays, Filter, TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";

function StatCard({
  title,
  value,
  deltaLabel,
  deltaPositive,
}: {
  title: string;
  value: string;
  deltaLabel: string;
  deltaPositive?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/70">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
            {value}
          </p>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span
              className={[
                "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold",
                deltaPositive
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                  : "bg-rose-50 text-rose-700 ring-1 ring-rose-100",
              ].join(" ")}
            >
              {deltaPositive ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              {deltaLabel}
            </span>
            <span className="text-zinc-500">from last month</span>
          </div>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-violet-600/10 text-violet-700">
          <div className="h-4 w-4 rounded-full bg-violet-600" />
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  right,
  children,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/70">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
        {right}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function DashboardPage() {
  const { stats } = useStatsContext();
  const { user } = useAuthContext();
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 to-violet-800 p-7 text-white shadow-sm">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/40 blur-2xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/30 blur-2xl" />
        </div>
        <div className="relative">
          <p className="text-sm/6 text-white/80">Dashboard</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            Hello, {user?.first_name} {user?.last_name}
          </h1>
          <p className="mt-1 text-sm text-white/80">
            It’s a blessing to have you with us today.
          </p>
        </div>
      </section>

      <div>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
            Overview
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-zinc-700 shadow-sm ring-1 ring-zinc-200/70 hover:bg-zinc-50"
            >
              <CalendarDays className="h-4 w-4 text-zinc-500" />
              Last month
            </button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200/70 hover:bg-zinc-50"
              aria-label="Filter"
            >
              <Filter className="h-4 w-4 text-zinc-500" />
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={stats?.total_users?.toString() || "0"}
            deltaLabel="+12%"
            deltaPositive
          />
          <StatCard
            title="Total Parishioners"
            value={stats?.total_parishioners?.toString() || "0"}
            deltaLabel="+3%"
            deltaPositive
          />
          <StatCard
            title="Total Priests"
            value={stats?.total_priests?.toString() || "0"}
            deltaLabel="+12%"
            deltaPositive
          />
          <StatCard
            title="Total Parish Admins"
            value={stats?.total_parish_admins?.toString() || "0"}
            deltaLabel="+12%"
            deltaPositive
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <SectionCard
          title="Registered Members"
          right={
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-700 ring-1 ring-zinc-200/70 hover:bg-zinc-100"
              >
                <CalendarDays className="h-4 w-4 text-zinc-500" />
                Last year
              </button>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-50 text-zinc-700 ring-1 ring-zinc-200/70 hover:bg-zinc-100"
                aria-label="Filter"
              >
                <Filter className="h-4 w-4 text-zinc-500" />
              </button>
            </div>
          }
        >
          <div className="grid h-[320px] place-items-center rounded-2xl bg-zinc-50 ring-1 ring-zinc-200/70">
            <div className="text-center">
              <p className="text-sm font-semibold text-zinc-900">
                Chart placeholder
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                You said to skip charts — this area is ready for later.
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Recent"
          right={
            <button
              type="button"
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-900"
            >
              See all
            </button>
          }
        >
          {/* <div className="space-y-3">
            {[
              { name: "Julia Cooper", role: "Supervisor", date: "05.04.25" },
              { name: "John Kelly", role: "Manager", date: "05.04.25" },
              { name: "James Moore", role: "Loader", date: "05.04.25" },
              { name: "Shelly Benson", role: "Supervisor", date: "05.04.25" },
              { name: "Alex Johnson", role: "Supervisor", date: "05.04.25" },
            ].map((u) => (
              <div
                key={u.name}
                className="flex items-center justify-between rounded-2xl px-2 py-2 hover:bg-zinc-50"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-2xl bg-zinc-200 ring-1 ring-zinc-200/70">
                    <Image
                      src="/Unum_Logo.svg"
                      alt={u.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 object-cover p-2"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">
                      {u.name}
                    </p>
                    <p className="text-xs text-zinc-500">{u.role}</p>
                  </div>
                </div>
                <p className="text-xs font-semibold text-zinc-500">{u.date}</p>
              </div>
            ))}
          </div> */}
            <div className="grid h-[320px] place-items-center rounded-2xl bg-zinc-50 ring-1 ring-zinc-200/70">
            <div className="text-center">
              <p className="text-sm font-semibold text-zinc-900">
                Recent Records
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Recent records will be displayed here.
              </p>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

