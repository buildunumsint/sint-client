import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "../AuthContext";
import { createApiClientSecured } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";
import { parseArray } from "@/lib/formatters";

export type SacramentsTypeContextType = {
  sacrament_types: SacramentsType[];
}

const SacramentsTypeContext = createContext<SacramentsTypeContextType | undefined>(undefined);

export const useSacramentsTypeContext = (): SacramentsTypeContextType => {
  const ctx = useContext(SacramentsTypeContext);
  if (!ctx) {
    throw new Error("useSacramentsTypeContext must be used within SacramentsTypeContextProvider");
  }
  return ctx;
};

const INIT_VALUES: SacramentsTypeContextType = {
  sacrament_types: [],
};


interface SacramentsTypeContextProviderProps {
  children: React.ReactNode;
}

export const SacramentsTypeContextProvider = ({ children }: SacramentsTypeContextProviderProps) => {
  const [sacramentsTypes, setSacramentsTypes] = useState<SacramentsType[]>([]);
  const { access_token, updateAccessToken } = useAuthContext();

  const apiClient = createApiClientSecured(access_token, updateAccessToken);

  const { data, isFetching } = useQuery({
    queryKey: ["sacraments_types"],
    queryFn: () => apiClient.get("/sacraments/types"),
    enabled: !!access_token,
  })
  useEffect(() => {
    if (data?.status && data?.data) {
      setSacramentsTypes(parseArray(data?.data?.sacraments_types));
    }
  }, [data, isFetching]);

  return <SacramentsTypeContext.Provider value={{ sacrament_types: sacramentsTypes }}>{children}</SacramentsTypeContext.Provider>;
};
