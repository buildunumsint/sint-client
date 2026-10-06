"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";

import { AnnouncementForm } from "../_components/AnnouncementForm";
import {
  useAnnouncement,
  useUpdateAnnouncement,
} from "../_hooks/useAnnouncements";

export default function EditAnnouncementPage() {
  const params = useParams<{ id: string }>();
  const id = params.id ?? "";
  const router = useRouter();

  const { data: announcement, isLoading, isError } = useAnnouncement(id);
  const updateMut = useUpdateAnnouncement(id);

  return (
    <div className="flex w-full flex-col gap-6">
      <button
        type="button"
        onClick={() => router.push("/dashboard/announcements")}
        className="inline-flex w-fit items-center gap-1 text-sm font-medium text-gray-text-4 hover:text-zinc-900"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to announcements
      </button>

      {isLoading ? (
        <FormSkeleton />
      ) : isError || !announcement ? (
        <Notice
          title="Announcement not found"
          body="It may have been deleted. Go back to the list and try again."
        />
      ) : (
        <>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              Edit Announcement
            </h1>
            <p className="mt-1 text-sm text-gray-text-4">{announcement.title}</p>
          </div>

          {/* `initial` seeds form state once; the form owns it from then on, so
              a background refetch can't clobber in-progress edits. */}
          <AnnouncementForm
            mode="edit"
            initial={announcement}
            saving={updateMut.isPending}
            onSubmit={(payload) =>
              updateMut.mutate(payload, {
                onSuccess: () => {
                  toast.success("Announcement saved");
                  router.push("/dashboard/announcements");
                },
                onError: (e) =>
                  toast.error(
                    e instanceof Error
                      ? e.message
                      : "Failed to save announcement",
                  ),
              })
            }
          />
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Notice({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-1 px-6 py-16 text-center">
      <p className="text-sm font-semibold text-zinc-900">{title}</p>
      <p className="max-w-md text-sm text-gray-text-4">{body}</p>
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-48 animate-pulse rounded-2xl border border-gray-1 bg-zinc-50"
        />
      ))}
    </div>
  );
}
