import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "../AuthContext";
import { createApiClientSecured } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";
import { parseArray } from "@/lib/formatters";
import { useArchiveFilters } from "@/app/dashboard/archive/_shared/hooks/useArchiveFilters";

export type SacramentTypesContextType = {
  sacramentTypes: SacramentsType[];
}

const SacramentTypesContext = createContext<SacramentTypesContextType | undefined>(undefined);

export const useSacramentTypesContext = (): SacramentTypesContextType => {
  const ctx = useContext(SacramentTypesContext);
  if (!ctx) {
    throw new Error("useSacramentTypesContext must be used within SacramentTypesContextProvider");
  }
  return ctx;
};

const INIT_VALUES: SacramentTypesContextType = {
  sacramentTypes: [],
};


interface SacramentTypesContextProviderProps {
  children: React.ReactNode;
}

export const sacramentNameFromType = (type: SacramentType | string) => {
  switch (type) {
    case "baptism":
      return "Baptism";
    case "confirmation":
      return "Confirmation";
    case "holy_eucharist":
      return "Eucharist";
    case "holy_orders":
    case "holy_order":
      return "Holy Orders";
    case "matrimony":
      return "Matrimony";
    default:
      return String(type);
  }
}
export const SacramentTypesContextProvider = ({ children }: SacramentTypesContextProviderProps) => {
  const [sacramentsTypes, setSacramentsTypes] = useState<SacramentsType[]>(INIT_VALUES.sacramentTypes);
  const { access_token, updateAccessToken } = useAuthContext();
  const { name, parishId } = useArchiveFilters();

  const apiClient = createApiClientSecured(access_token, updateAccessToken);

  const { data, isFetching } = useQuery({
    queryKey: ["sacraments_types", name, parishId],
    queryFn: () => apiClient.get(`/sacraments/types?parish=${parishId}`),
    enabled: !!access_token,
  })
  useEffect(() => {
    if (data?.status && data?.data) {
      setSacramentsTypes(parseArray(data?.data?.sacraments_types));
    }
  }, [data, isFetching]);

  return <SacramentTypesContext.Provider value={{ sacramentTypes: sacramentsTypes }}>{children}</SacramentTypesContext.Provider>;
};
