import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "../AuthContext";
import { createApiClientSecured } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";
import { parseArray } from "@/lib/formatters";

export type StatsContextType = {
  stats: StatsType
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const useStatsContext = (): StatsContextType => {
  const ctx = useContext(StatsContext);
  if (!ctx) {
    throw new Error("useStatsContext must be used within StatsContextProvider");
  }
  return ctx;
};

const INIT_VALUES: StatsContextType = {
  stats: {
    total_users: 0,
    total_parishioners: 0,
    total_priests: 0,
    total_parish_admins: 0,
  },
};


interface StatsContextProviderProps {
  children: React.ReactNode;
}

export const StatsContextProvider = ({ children }: StatsContextProviderProps) => {
  const [stats, setStats] = useState<StatsType>(INIT_VALUES.stats);
  const { access_token, updateAccessToken } = useAuthContext();

  const apiClient = createApiClientSecured(access_token, updateAccessToken);

  const { data, isFetching } = useQuery({
    queryKey: ["stats"],
    queryFn: () => apiClient.get("/users/statistics"),
    enabled: !!access_token,
  })
  useEffect(() => {
    if (data?.status && data?.data) {
      setStats(data?.data as StatsType);
    }
  }, [data, isFetching]);

  return <StatsContext.Provider value={{ stats }}>{children}</StatsContext.Provider>;
};
