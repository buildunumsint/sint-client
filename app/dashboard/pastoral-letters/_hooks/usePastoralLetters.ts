"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthContext } from "@/context/AuthContext";
import { createApiClientSecured } from "@/services/apiClient";

import type {
  CreateLetterPayload,
  PastoralLetter,
  UpdateLetterPayload,
} from "../_types";

/**
 * Reads are public on the server, but we go through the secured client anyway
 * so the dashboard shares one refresh path — and because writes need it.
 *
 * `createApiClientSecured` calls `useRouter()` internally, so it must be
 * invoked during render (here in the hook body), never inside a mutationFn.
 */

const LETTERS_KEY = ["pastoral-letters"] as const;

export const pastoralLetterKeys = {
  all: LETTERS_KEY,
  detail: (id: string) => [...LETTERS_KEY, id] as const,
};

export function usePastoralLetters() {
  const { access_token, updateAccessToken } = useAuthContext();
  const apiClient = createApiClientSecured(access_token, updateAccessToken);

  return useQuery({
    queryKey: pastoralLetterKeys.all,
    queryFn: async (): Promise<PastoralLetter[]> => {
      const res = await apiClient.get("/pastoral-letters");
      if (!res.status) {
        throw new Error(res.message || "Failed to load pastoral letters");
      }
      return (res.data ?? []) as PastoralLetter[];
    },
  });
}

export function usePastoralLetter(id: string) {
  const { access_token, updateAccessToken } = useAuthContext();
  const apiClient = createApiClientSecured(access_token, updateAccessToken);

  return useQuery({
    queryKey: pastoralLetterKeys.detail(id),
    queryFn: async (): Promise<PastoralLetter> => {
      const res = await apiClient.get(`/pastoral-letters/${id}`);
      if (!res.status) {
        throw new Error(res.message || "Failed to load pastoral letter");
      }
      return res.data as PastoralLetter;
    },
    enabled: Boolean(id),
  });
}

/**
 * Publishing a letter fans out a push notification to every registered device
 * on the server. There is no unsend, which is why the create form gates this
 * behind an explicit confirmation.
 */
export function useCreatePastoralLetter() {
  const { access_token, updateAccessToken } = useAuthContext();
  const apiClient = createApiClientSecured(access_token, updateAccessToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-pastoral-letter"],
    mutationFn: async (payload: CreateLetterPayload): Promise<PastoralLetter> => {
      const res = await apiClient.post("/pastoral-letters", payload);
      if (!res.status) {
        throw new Error(res.message || "Failed to publish letter");
      }
      return res.data as PastoralLetter;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pastoralLetterKeys.all });
    },
  });
}

/** Editing never re-sends the notification — the server leaves push_sent_at. */
export function useUpdatePastoralLetter(id: string) {
  const { access_token, updateAccessToken } = useAuthContext();
  const apiClient = createApiClientSecured(access_token, updateAccessToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-pastoral-letter", id],
    mutationFn: async (payload: UpdateLetterPayload): Promise<PastoralLetter> => {
      const res = await apiClient.put(`/pastoral-letters/${id}`, payload);
      if (!res.status) {
        throw new Error(res.message || "Failed to save letter");
      }
      return res.data as PastoralLetter;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pastoralLetterKeys.all });
      queryClient.invalidateQueries({ queryKey: pastoralLetterKeys.detail(id) });
    },
  });
}

export function useDeletePastoralLetter() {
  const { access_token, updateAccessToken } = useAuthContext();
  const apiClient = createApiClientSecured(access_token, updateAccessToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-pastoral-letter"],
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`/pastoral-letters/${id}`);
      if (!res.status) {
        throw new Error(res.message || "Failed to delete letter");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pastoralLetterKeys.all });
    },
  });
}
