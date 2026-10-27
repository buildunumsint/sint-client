import React, { createContext, useContext, useState } from "react";
import { useAuthContext } from "../AuthContext";
import { createApiClientSecured } from "@/services/apiClient";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

// Comparison windows the server accepts for ?days=.
export const STATS_DAYS_OPTIONS = [7, 14, 30] as const;
export type StatsDays = (typeof STATS_DAYS_OPTIONS)[number];

export type StatsContextType = {
  stats: StatsType;
  deviceStats: DeviceStatsType;
  days: StatsDays;
  setDays: (days: StatsDays) => void;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const useStatsContext = (): StatsContextType => {
  const ctx = useContext(StatsContext);
  if (!ctx) {
    throw new Error("useStatsContext must be used within StatsContextProvider");
  }
  return ctx;
};

const EMPTY_USER_COUNTS: UserStatsCounts = {
  total_users: 0,
  total_parishioners: 0,
  total_priests: 0,
  total_parish_admins: 0,
};

const INIT_STATS: StatsType = {
  days: 7,
  ...EMPTY_USER_COUNTS,
  previous: EMPTY_USER_COUNTS,
};

const INIT_DEVICE_STATS: DeviceStatsType = {
  days: 7,
  verified_installs: 0,
  previous_verified_installs: 0,
  by_platform: { ios: 0, android: 0 },
  active: 0,
  signed_in: 0,
};

interface StatsContextProviderProps {
  children: React.ReactNode;
}

export const StatsContextProvider = ({ children }: StatsContextProviderProps) => {
  const [days, setDays] = useState<StatsDays>(7);
  const { access_token, updateAccessToken } = useAuthContext();

  const apiClient = createApiClientSecured(access_token, updateAccessToken);

  // keepPreviousData holds the last period's numbers on screen while the
  // newly selected period loads, instead of flashing back to zeros.
  const { data: statsData } = useQuery({
    queryKey: ["stats", days],
    queryFn: () => apiClient.get(`/users/statistics?days=${days}`),
    enabled: !!access_token,
    placeholderData: keepPreviousData,
  });
  const { data: deviceStatsData } = useQuery({
    queryKey: ["device-stats", days],
    queryFn: () => apiClient.get(`/devices/statistics?days=${days}`),
    enabled: !!access_token,
    placeholderData: keepPreviousData,
  });

  // Error responses (e.g. 403 for non-super_admins) leave the zeroed defaults.
  // Spreading over them also keeps the cards rendering against a server that
  // predates the `previous` field.
  const stats: StatsType =
    statsData?.status && statsData?.data
      ? { ...INIT_STATS, ...statsData.data }
      : INIT_STATS;
  const deviceStats: DeviceStatsType =
    deviceStatsData?.status && deviceStatsData?.data
      ? { ...INIT_DEVICE_STATS, ...deviceStatsData.data }
      : INIT_DEVICE_STATS;

  return (
    <StatsContext.Provider value={{ stats, deviceStats, days, setDays }}>
      {children}
    </StatsContext.Provider>
  );
};
