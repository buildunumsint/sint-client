"use client";
import { useAuthContext } from "@/context/AuthContext";
import {
  STATS_DAYS_OPTIONS,
  StatsDays,
  useStatsContext,
} from "@/context/prefetch/StatsContext";
import {
  CalendarDays,
  Filter,
  Minus,
  Smartphone,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { Rect1, Rect2, Rect3 } from "./_shared/rectangles";
import { MembersIconFilled } from "./_shared/icons/MembersIcon";

type Delta = { tone: "up" | "down" | "flat"; label: string; detail: string };

// Totals compare today's count with how many of those rows existed `days`
// ago, so they only grow; "down" is kept for safety.
function describeDelta(value: number, previous: number, days: number): Delta {
  const change = value - previous;
  const window = `in the last ${days} days`;
  if (change === 0) return { tone: "flat", label: "No change", detail: window };

  const count = `${change > 0 ? "+" : "-"}${Math.abs(change).toLocaleString()}`;
  // A percentage from zero is meaningless, so show the raw count instead.
  if (previous === 0) return { tone: "up", label: `${count} new`, detail: window };

  const percent = (Math.abs(change) / previous) * 100;
  return {
    tone: change > 0 ? "up" : "down",
    label: `${change > 0 ? "+" : "-"}${percent.toLocaleString(undefined, { maximumFractionDigits: 1 })}%`,
    detail: `${count} ${window}`,
  };
}

function shareOf(part: number, whole: number): string {
  return whole > 0 ? `${Math.round((part / whole) * 100)}%` : "0%";
}

const DELTA_TONE = {
  up: { className: "text-sint-green", Icon: TrendingUp },
  down: { className: "text-sint-error-2", Icon: TrendingDown },
  flat: { className: "text-gray-text-4", Icon: Minus },
};

function InstallsIcon() {
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Smartphone className="h-4 w-4" />
    </span>
  );
}

function StatCard({
  title,
  value,
  previous,
  days,
  subtitle,
  icon = <MembersIconFilled />,
}: {
  title: string;
  value: number;
  // Omit for counts with no history to compare against.
  previous?: number;
  days: number;
  subtitle?: string;
  icon?: React.ReactNode;
}) {
  const delta =
    previous === undefined ? null : describeDelta(value, previous, days);
  const tone = delta ? DELTA_TONE[delta.tone] : null;
  return (
    <div className="rounded-[15px] bg-white shadow-sm border border-gray-1 flex flex-col gap-4 p-4">
      <div className="flex items-center gap-[6px]">
        {icon}
        <span className="text-gray-text-4">{title}</span>
      </div>
      <p className="text-3xl font-semibold tracking-tight">
        {value.toLocaleString()}
      </p>
      {delta && tone && (
        <div className="flex items-center gap-2 text-sm">
          <span
            className={[
              "inline-flex items-center gap-1 rounded-lg text-xs font-semibold",
              tone.className,
            ].join(" ")}
          >
            <tone.Icon className="h-3.5 w-3.5" />
            {delta.label}
          </span>
          <span>{delta.detail}</span>
        </div>
      )}
      {subtitle && <p className="text-sm text-gray-text-4">{subtitle}</p>}
    </div>
  );
}

function PeriodSelector({
  days,
  onChange,
}: {
  days: StatsDays;
  onChange: (days: StatsDays) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Comparison period"
      className="flex items-center gap-1 rounded-xl bg-gray-2 p-1 text-sm text-gray-text-4"
    >
      <CalendarDays className="mx-2 h-4 w-4" />
      {STATS_DAYS_OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={option === days}
          onClick={() => onChange(option)}
          className={[
            "rounded-lg px-3 py-1.5",
            option === days ? "bg-white font-semibold text-zinc-900 shadow-sm" : "",
          ].join(" ")}
        >
          {option} days
        </button>
      ))}
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
        <h2 className="text-gray-text-4">{title}</h2>
        {right}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function DashboardPage() {
  const { stats, deviceStats, days, setDays } = useStatsContext();
  const { user } = useAuthContext();
  return (
    <div className="flex flex-col gap-8 w-full">
      <section className="relative overflow-hidden rounded-3xl bg-primary py-[34px] px-12 text-white shadow-sm">
        <div className="relative">
          <h1 className="text-2xl font-semibold tracking-tight">
            Hello, {user?.first_name} {user?.last_name}
          </h1>
          <p className="mt-1">It’s a blessing to have you with us today.</p>
        </div>
        <div className="absolute right-[150px] bottom-0">
          <Rect3 />
        </div>
        <div className="absolute right-[30px] top-[-2px] z-10">
          <Rect2 />
        </div>
        <div className="absolute right-[-2px] bottom-0">
          <Rect1 />
        </div>
      </section>

      <div>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
          <PeriodSelector days={days} onChange={setDays} />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={stats.total_users}
            previous={stats.previous.total_users}
            days={days}
          />
          <StatCard
            title="Total Parishioners"
            value={stats.total_parishioners}
            previous={stats.previous.total_parishioners}
            days={days}
          />
          <StatCard
            title="Total Priests"
            value={stats.total_priests}
            previous={stats.previous.total_priests}
            days={days}
          />
          <StatCard
            title="Total Parish Admins"
            value={stats.total_parish_admins}
            previous={stats.previous.total_parish_admins}
            days={days}
          />
        </div>

        <h3 className="mt-6 text-gray-text-4">Mobile App</h3>
        <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Verified Installs"
            value={deviceStats.verified_installs}
            previous={deviceStats.previous_verified_installs}
            days={days}
            subtitle={`iOS ${deviceStats.by_platform.ios.toLocaleString()} · Android ${deviceStats.by_platform.android.toLocaleString()}`}
            icon={<InstallsIcon />}
          />
          <StatCard
            title="Active Installs"
            value={deviceStats.active}
            days={days}
            subtitle={`${shareOf(deviceStats.active, deviceStats.verified_installs)} of verified installs · opened in the last ${days} days`}
            icon={<InstallsIcon />}
          />
          <StatCard
            title="Signed-in Installs"
            value={deviceStats.signed_in}
            days={days}
            subtitle={`${shareOf(deviceStats.signed_in, deviceStats.verified_installs)} of verified installs`}
            icon={<InstallsIcon />}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <SectionCard
          title="Registered Members"
          right={
            <div className="flex items-center gap-2 text-gray-text-4 bg-gray-2  rounded-xl">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm"
              >
                <CalendarDays className="h-4 w-4 text-gray-text-4" />
                Last year
              </button>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl"
                aria-label="Filter"
              >
                <Filter className="h-4 w-4 text-gray-text-4" />
              </button>
            </div>
          }
        >
          <div className="grid h-[320px] place-items-center rounded-2xl ring-1 ring-zinc-200/70">
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
            <div className="flex items-center gap-2 text-gray-text-4 bg-gray-2  rounded-xl">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm"
              >
                <CalendarDays className="h-4 w-4 text-gray-text-4" />
                Last year
              </button>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl"
                aria-label="Filter"
              >
                <Filter className="h-4 w-4 text-gray-text-4" />
              </button>
            </div>
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
