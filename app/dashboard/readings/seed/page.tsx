"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertTriangle,
  CalendarPlus,
  ChevronLeft,
  RefreshCw,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { useSeedLiturgicalCalendar } from "../_hooks/useLiturgy";
import type {
  LitCalEpiphany,
  LitCalObservance,
  LitCalYearType,
  SeedLiturgyResult,
} from "../_types";

export default function SeedLiturgyPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentYear = new Date().getFullYear();

  const [year, setYear] = useState(currentYear);
  const [yearType, setYearType] = useState<LitCalYearType>("CIVIL");
  const [epiphany, setEpiphany] = useState<LitCalEpiphany>("JAN6");
  const [ascension, setAscension] = useState<LitCalObservance>("THURSDAY");
  const [corpusChristi, setCorpusChristi] =
    useState<LitCalObservance>("SUNDAY");
  const [eternalHighPriest, setEternalHighPriest] = useState(false);
  const [overwrite, setOverwrite] = useState(false);

  // Seeding is usually done ahead of need, so the window skews forward
  // rather than mirroring the calendar browser's current−2…+4.
  const years = useMemo(
    () => Array.from({ length: 7 }, (_, i) => currentYear - 1 + i),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const seedMut = useSeedLiturgicalCalendar();

  const handleSubmit = () => {
    seedMut.mutate(
      {
        year,
        year_type: yearType,
        epiphany,
        ascension,
        corpus_christi: corpusChristi,
        eternal_high_priest: eternalHighPriest,
        overwrite,
      },
      {
        onSuccess: (result) => {
          const parts = [`${result.inserted} added`];
          if (result.updated) parts.push(`${result.updated} refreshed`);
          if (result.skipped) parts.push(`${result.skipped} already present`);
          toast.success(`Calendar seeded — ${parts.join(", ")}`);
          queryClient.invalidateQueries({ queryKey: ["liturgy"] });
        },
        onError: (err) => {
          toast.error(
            err instanceof Error ? err.message : "Failed to seed calendar",
          );
        },
      },
    );
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <button
        type="button"
        onClick={() => router.push("/dashboard/readings")}
        className="inline-flex w-fit items-center gap-1 text-sm font-medium text-gray-text-4 hover:text-zinc-900"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to calendar
      </button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Seed Liturgical Calendar
        </h1>
        <p className="mt-1 text-sm text-gray-text-4">
          Fetches one year of the general Roman calendar from{" "}
          <a
            href="https://litcal.johnromanodorazio.com/"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-zinc-900"
          >
            LitCal
          </a>{" "}
          and writes it to <code className="font-mono">liturgical_days</code>{" "}
          — season, celebration, rank, color, and cycle for every date.
          Readings are managed separately and are never touched here.
        </p>
      </div>

      <section className="rounded-2xl border border-gray-1 bg-white p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Year">
            <Select
              value={String(year)}
              onValueChange={(v) => setYear(Number(v))}
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
          </Field>

          <Field
            label="Year type"
            hint={
              yearType === "LITURGICAL"
                ? "Covers Advent of the prior year through Christ the King — leaves a gap at the end of this civil year until it's seeded too."
                : "Covers January 1 through December 31 in full."
            }
          >
            <Select
              value={yearType}
              onValueChange={(v) => setYearType(v as LitCalYearType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CIVIL">
                  Civil year (Jan 1 – Dec 31)
                </SelectItem>
                <SelectItem value="LITURGICAL">
                  Liturgical year (Advent – Christ the King)
                </SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Epiphany">
            <Select
              value={epiphany}
              onValueChange={(v) => setEpiphany(v as LitCalEpiphany)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="JAN6">January 6</SelectItem>
                <SelectItem value="SUNDAY_JAN2_JAN8">
                  Nearest Sunday (Jan 2–8)
                </SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Ascension">
            <Select
              value={ascension}
              onValueChange={(v) => setAscension(v as LitCalObservance)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="THURSDAY">
                  Thursday (40 days after Easter)
                </SelectItem>
                <SelectItem value="SUNDAY">
                  Sunday (7th Sunday of Easter)
                </SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Corpus Christi">
            <Select
              value={corpusChristi}
              onValueChange={(v) => setCorpusChristi(v as LitCalObservance)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="THURSDAY">Thursday</SelectItem>
                <SelectItem value="SUNDAY">Sunday</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-gray-1 pt-5">
          <CheckboxRow
            checked={eternalHighPriest}
            onChange={setEternalHighPriest}
            label="Eternal High Priest"
            description={
              'Adds the optional "Our Lord Jesus Christ, Eternal High Priest" feast (Thursday after Pentecost).'
            }
          />
          <CheckboxRow
            checked={overwrite}
            onChange={setOverwrite}
            label="Overwrite existing days"
            description="Refreshes season, celebration, rank, color, and cycle on days already in the calendar. Any Note or Reflection an admin has added is never touched, even for days this refreshes."
            emphasis="warning"
          />
        </div>

        <div className="mt-6 flex justify-end border-t border-gray-1 pt-5">
          <Button
            size="xl"
            loading={seedMut.isPending}
            onClick={handleSubmit}
          >
            {overwrite ? (
              <RefreshCw className="h-4 w-4" />
            ) : (
              <CalendarPlus className="h-4 w-4" />
            )}
            {overwrite ? `Re-seed ${year}` : `Seed ${year}`}
          </Button>
        </div>
      </section>

      {seedMut.data ? <ResultPanel result={seedMut.data} /> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function ResultPanel({ result }: { result: SeedLiturgyResult }) {
  return (
    <section className="rounded-2xl border border-gray-1 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">Result</h2>
      <p className="mt-1 text-sm text-gray-text-4">
        {result.fromDate} – {result.toDate}
      </p>

      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Requested" value={result.requested} />
        <Stat label="Added" value={result.inserted} />
        <Stat label="Refreshed" value={result.updated} />
        <Stat label="Already present" value={result.skipped} />
      </dl>

      {result.warnings && result.warnings.length > 0 ? (
        <div className="mt-4 flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
          {result.warnings.map((w, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-amber-900">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{w}</p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-zinc-50 px-3 py-2">
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-text-4">
        {label}
      </dt>
      <dd className="mt-0.5 text-lg font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <Label className="mb-2 text-sm font-semibold">{label}</Label>
      {children}
      {hint ? <p className="mt-1.5 text-xs text-gray-text-4">{hint}</p> : null}
    </div>
  );
}

function CheckboxRow({
  checked,
  onChange,
  label,
  description,
  emphasis,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description: string;
  emphasis?: "warning";
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3",
        emphasis === "warning" && checked
          ? "border-amber-300 bg-amber-50"
          : "border-gray-1 bg-zinc-50",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-1 text-primary focus:ring-primary"
      />
      <span>
        <span className="block text-sm font-semibold text-zinc-900">
          {label}
        </span>
        <span className="mt-0.5 block text-xs text-gray-text-4">
          {description}
        </span>
      </span>
    </label>
  );
}
