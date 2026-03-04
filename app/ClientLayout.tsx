"use client";
import { AuthContextProvider } from '@/context/AuthContext';
import React from 'react'
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { SacramentTypesContextProvider } from '@/context/prefetch/SacramentTypesContext';
import { StatsContextProvider } from '@/context/prefetch/StatsContext';
import { ParishesContextProvider } from '@/context/prefetch/ParishesContext';

const queryClient = new QueryClient()

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" />
      <AuthContextProvider>
        <StatsContextProvider>
          <SacramentTypesContextProvider>
            <ParishesContextProvider>
              {children}
            </ParishesContextProvider>
          </SacramentTypesContextProvider>
        </StatsContextProvider>

      </AuthContextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default ClientLayout;