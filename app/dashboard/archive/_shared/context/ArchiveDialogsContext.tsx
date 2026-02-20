"use client";

import React, { createContext, useCallback, useContext, useMemo, useReducer } from "react";

interface DialogProp {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ArchiveDialogsContextType {
  createSacrament: DialogProp;
}

type ArchiveDialogsState = {
  createSacramentOpen: boolean;
};

type ArchiveDialogsAction = { type: "SET_CREATE_SACRAMENT_OPEN"; open: boolean };

const INIT_STATE: ArchiveDialogsState = {
  createSacramentOpen: false,
};

function archiveDialogsReducer(state: ArchiveDialogsState, action: ArchiveDialogsAction): ArchiveDialogsState {
  switch (action.type) {
    case "SET_CREATE_SACRAMENT_OPEN":
      return { ...state, createSacramentOpen: action.open };
    default:
      return state;
  }
}

const ArchiveDialogsContext = createContext<ArchiveDialogsContextType | undefined>(undefined);

export const useArchiveDialogs = () => {
  const ctx = useContext(ArchiveDialogsContext);
  if (!ctx) {
    throw new Error("useArchiveDialogs must be used within ArchiveDialogsProvider");
  }
  return ctx;
};

export const ArchiveDialogsProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(archiveDialogsReducer, INIT_STATE);

  const onCreateSacramentOpenChange = useCallback((open: boolean) => {
    dispatch({ type: "SET_CREATE_SACRAMENT_OPEN", open });
  }, []);

  const value: ArchiveDialogsContextType = useMemo(
    () => ({
      createSacrament: {
        isOpen: state.createSacramentOpen,
        onOpenChange: onCreateSacramentOpenChange,
      },
    }),
    [onCreateSacramentOpenChange, state.createSacramentOpen],
  );

  return <ArchiveDialogsContext.Provider value={value}>{children}</ArchiveDialogsContext.Provider>;
};