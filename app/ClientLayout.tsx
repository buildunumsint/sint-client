"use client";
import { AuthContextProvider } from '@/context/AuthContext';
import React from 'react'
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { SacramentsTypeContextProvider } from '@/context/prefetch/SacramentTypesContext';

const queryClient = new QueryClient()

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" />
      <AuthContextProvider>
        <SacramentsTypeContextProvider>
          {children}
        </SacramentsTypeContextProvider>
      </AuthContextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default ClientLayout