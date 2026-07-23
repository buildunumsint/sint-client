"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { CalendarDays, Info, PenLine } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { FeastRow } from "./_components/FeastRow";
import { useLiturgicalMonth } from "./_hooks/useLiturgy";
import type { LiturgicalDaySummary } from "./_types";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function daysInMonth(year: number, month1: number) {
  // month1 is 1-based; day 0 of the next month is the last day of this month.
  return new Date(year, month1, 0).getDate();
}

export default function ReadingsPage() {
  const now = new Date();
  const today = format(now, "yyyy-MM-dd");

  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1); // 1-based
  const [selectedDate, setSelectedDate] = useState<string>(today);

  const { data: days, isLoading, isError, refetch } = useLiturgicalMonth(
    viewYear,
    viewMonth,
  );

  const totalDays = daysInMonth(viewYear, viewMonth);
  const yearCycle = days?.[0]?.yearCycle;

  // Years window mirrors the seeded range (current year −2 … +4).
  const years = useMemo(
    () => Array.from({ length: 7 }, (_, i) => now.getFullYear() - 2 + i),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const selectedDay: LiturgicalDaySummary | undefined = useMemo(
    () => days?.find((d) => d.date === selectedDate),
    [days, selectedDate],
  );

  const selectDay = (day: number) => {
    const iso = `${viewYear}-${String(viewMonth).padStart(2, "0")}-${String(
      day,
    ).padStart(2, "0")}`;
    setSelectedDate(iso);
  };

  // The day-of-month currently reflected by the Day dropdown.
  const selectedInView =
    selectedDate.startsWith(
      `${viewYear}-${String(viewMonth).padStart(2, "0")}`,
    ) ? Number(selectedDate.slice(8, 10)) : undefined;

  // When a month loads, center the relevant day in the scroll list — today if
  // it falls in the viewed month, otherwise the selected day. Keyed on `days`
  // only, so clicking a row doesn't yank the list around.
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!days || days.length === 0) return;
    const target = days.some((d) => d.date === today)
      ? today
      : days.some((d) => d.date === selectedDate)
        ? selectedDate
        : null;
    if (!target) return;

    const idx = days.findIndex((d) => d.date === target);
    const container = listRef.current;
    const row = container?.children[idx] as HTMLElement | undefined;
    if (!container || !row) return;

    const cRect = container.getBoundingClientRect();
    const rRect = row.getBoundingClientRect();
    container.scrollTop +=
      rRect.top - cRect.top - (container.clientHeight - row.clientHeight) / 2;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Liturgical Readings
        </h1>
        <p className="mt-1 text-sm text-gray-text-4">
          Select a day from the calendar to manage its Mass readings.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Calendar selector */}
        <section className="rounded-2xl border border-gray-1 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">
                Liturgical Feasts
              </h2>
              <p className="text-sm text-gray-text-4">
                {MONTHS[viewMonth - 1]} {viewYear}
                {yearCycle ? ` • Year ${yearCycle}` : ""}
              </p>
            </div>
            <CalendarDays className="h-5 w-5 text-gray-text-4" />
          </div>

          {/* Day / Month / Year pickers */}
          <div className="mt-4 flex gap-2">
            <div className="w-20">
              <Select
                value={selectedInView ? String(selectedInView) : undefined}
                onValueChange={(v) => selectDay(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
                    <SelectItem key={d} value={String(d)}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Select
                value={String(viewMonth)}
                onValueChange={(v) => setViewMonth(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m, i) => (
                    <SelectItem key={m} value={String(i + 1)}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-28">
              <Select
                value={String(viewYear)}
                onValueChange={(v) => setViewYear(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Day list */}
          <div className="mt-5">
            {isLoading ? (
              <ListSkeleton />
            ) : isError ? (
              <EmptyState
                title="Couldn't load the calendar"
                body="Check that the API is running, then try again."
                action={
                  <button
                    type="button"
                    onClick={() => refetch()}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                  >
                    Retry
                  </button>
                }
              />
            ) : !days || days.length === 0 ? (
              <EmptyState
                title="No days for this month"
                body="The liturgical calendar hasn't been seeded yet. Run `make setupdb` (or `make seed`) on sint-server, then reload."
              />
            ) : (
              <div
                ref={listRef}
                className="flex max-h-[540px] flex-col gap-3 overflow-y-auto pr-1"
              >
                {days.map((day) => (
                  <FeastRow
                    key={day.date}
                    day={day}
                    selected={day.date === selectedDate}
                    isToday={day.date === today}
                    onSelect={() => setSelectedDate(day.date)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Selected-day panel */}
        <SelectedDayPanel day={selectedDay} selectedDate={selectedDate} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function SelectedDayPanel({
  day,
  selectedDate,
}: {
  day: LiturgicalDaySummary | undefined;
  selectedDate: string;
}) {
  const router = useRouter();
  const prettyDate = format(parseISO(selectedDate), "EEEE, d MMMM yyyy");
  const hasReadings = day?.hasReadings ?? false;

  return (
    <section className="h-fit rounded-2xl border border-gray-1 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
        Selected day
      </p>
      <h2 className="mt-1 text-lg font-semibold text-zinc-900">{prettyDate}</h2>

      {day ? (
        <>
          <p className="mt-1 text-sm text-gray-text-4">{day.celebration}</p>

          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <Meta label="Season" value={day.season} />
            <Meta label="Week" value={day.seasonWeek ? String(day.seasonWeek) : "—"} />
            <Meta label="Rank" value={day.rank} />
            <Meta label="Color" value={day.color} />
            <Meta label="Year cycle" value={day.yearCycle} />
            <Meta
              label="Readings"
              value={day.hasReadings ? "Uploaded" : "None yet"}
            />
          </dl>

          {day.saint ? (
            <p className="mt-3 text-sm text-gray-text-4">
              <span className="font-semibold text-zinc-700">Saint: </span>
              {day.saint}
            </p>
          ) : null}
          {day.note ? (
            <p className="mt-1 text-sm text-gray-text-4">
              <span className="font-semibold text-zinc-700">Note: </span>
              {day.note}
            </p>
          ) : null}

          <Button
            size="xl"
            className="mt-5 w-full"
            onClick={() => router.push(`/dashboard/readings/${selectedDate}`)}
          >
            <PenLine className="h-4 w-4" />
            {hasReadings ? "Edit readings" : "Register readings"}
          </Button>
        </>
      ) : (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-zinc-50 p-3 text-sm text-gray-text-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            This date isn&apos;t in the loaded month, or the calendar hasn&apos;t
            been seeded. Pick a day from the list.
          </p>
        </div>
      )}
    </section>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-zinc-50 px-3 py-2">
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-text-4">
        {label}
      </dt>
      <dd className="mt-0.5 font-medium capitalize text-zinc-900">{value}</dd>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-[68px] animate-pulse rounded-2xl border border-gray-1 bg-zinc-50"
        />
      ))}
    </div>
  );
}

function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-1 px-6 py-12 text-center",
      )}
    >
      <p className="text-sm font-semibold text-zinc-900">{title}</p>
      <p className="max-w-sm text-sm text-gray-text-4">{body}</p>
      {action}
    </div>
  );
}
