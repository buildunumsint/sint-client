"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthContext } from "@/context/AuthContext";
import { createApiClientSecured } from "@/services/apiClient";

import type { LiturgicalDay, LiturgicalDaySummary } from "../_types";

/**
 * The backend stores `date` as a Postgres DATE. Defensively trim any stray time
 * component so every consumer (routing, comparisons, the TODAY pill) gets a
 * plain "YYYY-MM-DD".
 */
const normalizeDate = <T extends { date: string }>(d: T): T => ({
  ...d,
  date: (d.date ?? "").slice(0, 10),
});

/**
 * Every day of a month (1-based `month`), from `GET /liturgy/month/:year/:month`.
 * Lightweight summaries (metadata + `hasReadings`); the full readings come from
 * {@link useLiturgicalDay} when a day is opened.
 */
export function useLiturgicalMonth(year: number, month: number) {
  const { access_token, updateAccessToken } = useAuthContext();
  const apiClient = createApiClientSecured(access_token, updateAccessToken);

  return useQuery({
    queryKey: ["liturgy", "month", year, month],
    queryFn: async (): Promise<LiturgicalDaySummary[]> => {
      const res = await apiClient.get(`/liturgy/month/${year}/${month}`);
      if (!res.status) {
        throw new Error(res.message || "Failed to load liturgical calendar");
      }
      return ((res.data ?? []) as LiturgicalDaySummary[]).map(normalizeDate);
    },
  });
}

/** A single liturgical day, from `GET /liturgy/day/:date`. */
export function useLiturgicalDay(date: string) {
  const { access_token, updateAccessToken } = useAuthContext();
  const apiClient = createApiClientSecured(access_token, updateAccessToken);

  return useQuery({
    queryKey: ["liturgy", "day", date],
    queryFn: async (): Promise<LiturgicalDay> => {
      const res = await apiClient.get(`/liturgy/day/${date}`);
      if (!res.status) {
        throw new Error(res.message || "Failed to load day");
      }
      return normalizeDate(res.data as LiturgicalDay);
    },
    enabled: Boolean(date),
  });
}
