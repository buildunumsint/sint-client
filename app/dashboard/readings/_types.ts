/**
 * Readings & liturgical-calendar domain models.
 * Mirrors the sint-mobile `LiturgicalDay` contract so the admin and the
 * mobile app consume the same shape from `GET /liturgy/*`.
 */

export type LiturgicalSeason =
  | "Advent"
  | "Christmas"
  | "Ordinary Time"
  | "Lent"
  | "Easter";

/** Rank of a celebration, highest → lowest. */
export type FeastRank =
  | "Solemnity"
  | "Feast"
  | "Memorial"
  | "Optional Memorial"
  | "Weekday";

/** Liturgical color of the day's vestments. */
export type LiturgicalColor = "green" | "violet" | "white" | "red" | "rose";

/** Which block of the Liturgy of the Word a section represents. */
export type ReadingKind =
  | "first"
  | "psalm"
  | "second"
  | "acclamation"
  | "gospel";

export interface ReadingSection {
  kind: ReadingKind;
  label: string;
  reference: string;
  heading?: string;
  body?: string;
  response?: string;
  verses?: string[];
}

export interface Reflection {
  title: string;
  body: string;
}

/** A single day of the liturgical calendar, with its Mass readings. */
export interface LiturgicalDay {
  /** ISO calendar date, 'YYYY-MM-DD'. */
  date: string;
  season: LiturgicalSeason;
  seasonWeek?: number;
  celebration: string;
  rank: FeastRank;
  color: LiturgicalColor;
  saint?: string | null;
  note?: string | null;
  yearCycle: "A" | "B" | "C";
  reflection?: Reflection | null;
  readings: ReadingSection[];
}

/**
 * Lightweight calendar-list projection from `GET /liturgy/month/:year/:month`.
 * Metadata + a `hasReadings` flag, without the (large) reading bodies — those
 * come from the per-day fetch when editing.
 */
export interface LiturgicalDaySummary {
  date: string;
  season: LiturgicalSeason;
  seasonWeek?: number;
  celebration: string;
  rank: FeastRank;
  color: LiturgicalColor;
  saint?: string | null;
  note?: string | null;
  yearCycle: "A" | "B" | "C";
  hasReadings: boolean;
}
