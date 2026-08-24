"use client";

import { format, parseISO } from "date-fns";

import { cn } from "@/lib/utils";
import type {
  FeastRank,
  LiturgicalColor,
  LiturgicalDaySummary,
  LiturgicalSeason,
} from "../_types";

/* --- Tag (rank / season pill), ported from mobile RankPill --- */

type Tone = "violet" | "green" | "gold" | "red" | "solid";

const TONE: Record<Tone, string> = {
  violet: "bg-primary/10 text-primary",
  green: "bg-sint-green/10 text-sint-green",
  gold: "bg-amber-100 text-amber-700",
  red: "bg-sint-error/10 text-sint-error",
  solid: "bg-primary text-white",
};

const SEASON_TONE: Record<LiturgicalSeason, Tone> = {
  Advent: "violet",
  Lent: "violet",
  Christmas: "gold",
  Easter: "gold",
  "Ordinary Time": "green",
};

const RANK_TONE: Record<Exclude<FeastRank, "Weekday">, Tone> = {
  Solemnity: "solid",
  Feast: "gold",
  Memorial: "green",
  "Optional Memorial": "green",
};

/** On ferial days show the season; on named celebrations show the rank. */
function dayTag(day: LiturgicalDaySummary): { label: string; tone: Tone } {
  if (day.rank === "Weekday") {
    return { label: day.season.toUpperCase(), tone: SEASON_TONE[day.season] };
  }
  return { label: day.rank.toUpperCase(), tone: RANK_TONE[day.rank] };
}

function Pill({ label, tone }: { label: string; tone: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-[3px] text-[10px] font-bold uppercase tracking-wide",
        TONE[tone],
      )}
    >
      {label}
    </span>
  );
}

/* --- Vestment-color dot (data exists in the model; surfaced here for admins) --- */

const COLOR_DOT: Record<LiturgicalColor, string> = {
  green: "bg-green-600",
  violet: "bg-violet-600",
  white: "bg-zinc-300",
  red: "bg-red-600",
  rose: "bg-rose-400",
};

/* --- Row --- */

interface FeastRowProps {
  day: LiturgicalDaySummary;
  selected?: boolean;
  isToday?: boolean;
  onSelect?: () => void;
}

/** One day in the Liturgical Feasts calendar list. */
export function FeastRow({ day, selected, isToday, onSelect }: FeastRowProps) {
  const d = parseISO(day.date);
  const tag = dayTag(day);
  const hasReadings = day.hasReadings;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-4 rounded-2xl border p-3.5 text-left transition-colors",
        selected
          ? "border-primary/40 bg-primary/5"
          : "border-gray-1 bg-white hover:bg-zinc-50",
      )}
    >
      <div className="w-10 shrink-0 text-center">
        <p
          className={cn(
            "text-xl font-extrabold leading-none",
            selected ? "text-primary" : "text-zinc-900",
          )}
        >
          {format(d, "d")}
        </p>
        <p className="mt-0.5 text-[11px] font-semibold uppercase text-gray-text-4">
          {format(d, "EEE")}
        </p>
      </div>

      <span
        className={cn("h-2.5 w-2.5 shrink-0 rounded-full", COLOR_DOT[day.color])}
        title={`${day.color} vestments`}
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Pill label={tag.label} tone={tag.tone} />
          {isToday ? <Pill label="TODAY" tone="solid" /> : null}
          {hasReadings ? (
            <span className="inline-flex items-center rounded-md bg-sint-green/10 px-2 py-[3px] text-[10px] font-bold uppercase tracking-wide text-sint-green">
              Readings set
            </span>
          ) : null}
        </div>
        <p className="mt-1.5 line-clamp-2 text-sm font-semibold text-zinc-900">
          {day.celebration}
        </p>
      </div>
    </button>
  );
}
