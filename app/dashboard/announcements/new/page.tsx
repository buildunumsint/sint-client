"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";

import { AnnouncementForm } from "../_components/AnnouncementForm";
import { useCreateAnnouncement } from "../_hooks/useAnnouncements";

export default function NewAnnouncementPage() {
  const router = useRouter();
  const createMut = useCreateAnnouncement();

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

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          New Announcement
        </h1>
        <p className="mt-1 text-sm text-gray-text-4">
          Compose an event or letter and publish it to the app.
        </p>
      </div>

      <AnnouncementForm
        mode="create"
        saving={createMut.isPending}
        onSubmit={(payload) =>
          createMut.mutate(payload, {
            onSuccess: () => {
              toast.success("Announcement published");
              router.push("/dashboard/announcements");
            },
            onError: (e) =>
              toast.error(
                e instanceof Error
                  ? e.message
                  : "Failed to publish announcement",
              ),
          })
        }
      />
    </div>
  );
}
