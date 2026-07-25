import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "../AuthContext";
import { createApiClient, createApiClientSecured } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";
import { parseArray } from "@/lib/formatters";

export type ParishesContextType = {
  parishes: ParishType[];
}

const ParishesContext = createContext<ParishesContextType | undefined>(undefined);

export const useParishesContext = (): ParishesContextType => {
  const ctx = useContext(ParishesContext);
  if (!ctx) {
    throw new Error("useParishesContext must be used within ParishesContextProvider");
  }
  return ctx;
};

const INIT_VALUES: ParishesContextType = {
  parishes: [],
};


interface ParishesContextProviderProps {
  children: React.ReactNode;
}

export const ParishesContextProvider = ({ children }: ParishesContextProviderProps) => {
  const [parishes, setParishes] = useState<ParishType[]>(INIT_VALUES.parishes);
  const { access_token, updateAccessToken } = useAuthContext();

  const apiClient = createApiClient();

  const { data, isFetching } = useQuery({
    queryKey: ["parishes"],
    queryFn: () => apiClient.get("/parishes/all"),
    enabled: !!access_token,
  })
  useEffect(() => {
    if (data?.status && data?.data) {
      setParishes(parseArray(data?.data?.parishes));
    }
  }, [data, isFetching]);

  return <ParishesContext.Provider value={{ parishes }}>{children}</ParishesContext.Provider>;
};
