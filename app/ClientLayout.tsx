"use client";
import { AuthContextProvider } from "@/context/AuthContext";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

// Only app-wide providers belong here. Anything that reads the URL
// (useSearchParams) or fetches authenticated data lives in the dashboard
// layout instead — mounting it here opts every route, including the public
// marketing pages, out of server rendering.
const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" />
      <AuthContextProvider>{children}</AuthContextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default ClientLayout;
