"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthContext } from "@/context/AuthContext";
import { createApiClientSecured } from "@/services/apiClient";

import type {
  Announcement,
  CreateAnnouncementPayload,
  UpdateAnnouncementPayload,
} from "../_types";

/**
 * Same shape as the pastoral letters hooks: reads are public on the server
 * but go through the secured client so the dashboard shares one refresh path.
 *
 * `createApiClientSecured` calls `useRouter()` internally, so it must be
 * invoked during render (here in the hook body), never inside a mutationFn.
 */

const ANNOUNCEMENTS_KEY = ["announcements"] as const;

export const announcementKeys = {
  all: ANNOUNCEMENTS_KEY,
  detail: (id: string) => [...ANNOUNCEMENTS_KEY, id] as const,
};

export function useAnnouncements() {
  const { access_token, updateAccessToken } = useAuthContext();
  const apiClient = createApiClientSecured(access_token, updateAccessToken);

  return useQuery({
    queryKey: announcementKeys.all,
    queryFn: async (): Promise<Announcement[]> => {
      const res = await apiClient.get("/announcements");
      if (!res.status) {
        throw new Error(res.message || "Failed to load announcements");
      }
      return (res.data ?? []) as Announcement[];
    },
  });
}

export function useAnnouncement(id: string) {
  const { access_token, updateAccessToken } = useAuthContext();
  const apiClient = createApiClientSecured(access_token, updateAccessToken);

  return useQuery({
    queryKey: announcementKeys.detail(id),
    queryFn: async (): Promise<Announcement> => {
      const res = await apiClient.get(`/announcements/${id}`);
      if (!res.status) {
        throw new Error(res.message || "Failed to load announcement");
      }
      return res.data as Announcement;
    },
    enabled: Boolean(id),
  });
}

export function useCreateAnnouncement() {
  const { access_token, updateAccessToken } = useAuthContext();
  const apiClient = createApiClientSecured(access_token, updateAccessToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-announcement"],
    mutationFn: async (
      payload: CreateAnnouncementPayload,
    ): Promise<Announcement> => {
      const res = await apiClient.post("/announcements", payload);
      if (!res.status) {
        throw new Error(res.message || "Failed to publish announcement");
      }
      return res.data as Announcement;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: announcementKeys.all });
    },
  });
}

/**
 * Saving can replace the banner, and the server deletes the old image right
 * away. Write the response into the cache before navigating back: otherwise
 * the list first renders its stale rows, which still point at the deleted
 * image, and flashes a broken thumbnail until the refetch lands.
 */
export function useUpdateAnnouncement(id: string) {
  const { access_token, updateAccessToken } = useAuthContext();
  const apiClient = createApiClientSecured(access_token, updateAccessToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-announcement", id],
    mutationFn: async (
      payload: UpdateAnnouncementPayload,
    ): Promise<Announcement> => {
      const res = await apiClient.put(`/announcements/${id}`, payload);
      if (!res.status) {
        throw new Error(res.message || "Failed to save announcement");
      }
      return res.data as Announcement;
    },
    onSuccess: (saved) => {
      queryClient.setQueryData<Announcement[]>(announcementKeys.all, (list) =>
        list?.map((a) => (a.id === saved.id ? saved : a)),
      );
      queryClient.setQueryData(announcementKeys.detail(id), saved);
      queryClient.invalidateQueries({ queryKey: announcementKeys.all });
    },
  });
}

export function useDeleteAnnouncement() {
  const { access_token, updateAccessToken } = useAuthContext();
  const apiClient = createApiClientSecured(access_token, updateAccessToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-announcement"],
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`/announcements/${id}`);
      if (!res.status) {
        throw new Error(res.message || "Failed to delete announcement");
      }
      return res.data;
    },
    // Drop the row now rather than after the refetch — its banner is already
    // gone from R2, so a lingering row would show a broken thumbnail.
    onSuccess: (_data, id) => {
      queryClient.setQueryData<Announcement[]>(announcementKeys.all, (list) =>
        list?.filter((a) => a.id !== id),
      );
      queryClient.removeQueries({ queryKey: announcementKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: announcementKeys.all });
    },
  });
}

/**
 * Uploads a banner to R2 (via sint-server) and resolves to its public URL,
 * which is then sent as `bannerUrl` on create/update.
 *
 * Uses the "form" (multipart) client: the default JSON client would serialise
 * the FormData to JSON. Axios drops the bare multipart Content-Type for
 * FormData so the browser can add the boundary.
 */
export function useUploadAnnouncementBanner() {
  const { access_token, updateAccessToken } = useAuthContext();
  const apiClient = createApiClientSecured(
    access_token,
    updateAccessToken,
    "form",
  );

  return useMutation({
    mutationKey: ["upload-announcement-banner"],
    mutationFn: async (file: File): Promise<string> => {
      const form = new FormData();
      form.append("file", file);
      const res = await apiClient.post("/announcements/banner", form);
      if (!res.status) {
        throw new Error(res.message || "Failed to upload banner");
      }
      return (res.data as { url: string }).url;
    },
  });
}
