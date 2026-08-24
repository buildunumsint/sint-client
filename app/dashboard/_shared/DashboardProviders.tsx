"use client";

import React, { Suspense } from "react";
import { SacramentTypesContextProvider } from "@/context/prefetch/SacramentTypesContext";
import { StatsContextProvider } from "@/context/prefetch/StatsContext";
import { ParishesContextProvider } from "@/context/prefetch/ParishesContext";

// These providers prefetch authenticated data and read the URL query string,
// so they can only render on the client. The Suspense boundary keeps that
// bailout scoped to the dashboard.
const DashboardProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StatsContextProvider>
        <SacramentTypesContextProvider>
          <ParishesContextProvider>{children}</ParishesContextProvider>
        </SacramentTypesContextProvider>
      </StatsContextProvider>
    </Suspense>
  );
};

export default DashboardProviders;
