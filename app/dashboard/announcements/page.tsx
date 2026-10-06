"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { Megaphone, PenLine, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { formatEventDates, formatEventTimes } from "./_format";
import {
  useAnnouncements,
  useDeleteAnnouncement,
} from "./_hooks/useAnnouncements";
import { ANNOUNCEMENT_TYPE_LABELS, type Announcement } from "./_types";

export default function AnnouncementsPage() {
  const router = useRouter();
  const { data: announcements, isLoading, isError, refetch } =
    useAnnouncements();
  const [pendingDelete, setPendingDelete] = useState<Announcement | null>(
    null,
  );

  const deleteMut = useDeleteAnnouncement();

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const { id, title } = pendingDelete;
    deleteMut.mutate(id, {
      onSuccess: () => {
        toast.success(`“${title}” deleted`);
        setPendingDelete(null);
      },
      onError: (e) =>
        toast.error(
          e instanceof Error ? e.message : "Failed to delete announcement",
        ),
    });
  };

  const goNew = () => router.push("/dashboard/announcements/new");

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Announcements
          </h1>
          <p className="mt-1 text-sm text-gray-text-4">
            Publish diocesan events and letters to the app’s “Diocesan
            Announcements” feed.
          </p>
        </div>
        <Button size="xl" onClick={goNew}>
          <Plus className="h-4 w-4" />
          New announcement
        </Button>
      </div>

      <section className="rounded-2xl border border-gray-1 bg-white p-5 shadow-sm">
        {isLoading ? (
          <ListSkeleton />
        ) : isError ? (
          <EmptyState
            title="Couldn't load announcements"
            body="Check that the API is running, then try again."
            action={
              <Button variant="outline" onClick={() => refetch()}>
                Retry
              </Button>
            }
          />
        ) : !announcements || announcements.length === 0 ? (
          <EmptyState
            title="No announcements yet"
            body="Publish an event or letter and it will appear in the app under “Diocesan Announcements”."
            action={
              <Button onClick={goNew}>
                <Plus className="h-4 w-4" />
                New announcement
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-1">
                  <Th>Announcement</Th>
                  <Th>Type</Th>
                  <Th>Details</Th>
                  <Th>Published</Th>
                  <th className="pb-3" />
                </tr>
              </thead>
              <tbody>
                {announcements.map((a) => (
                  <tr key={a.id} className="border-b border-gray-1 last:border-0">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        {a.bannerUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element -- R2 host isn't in next/image remotePatterns
                          <img
                            src={a.bannerUrl}
                            alt=""
                            className="h-10 w-[49px] shrink-0 rounded-md object-cover"
                          />
                        ) : (
                          <div className="h-10 w-[49px] shrink-0 rounded-md bg-zinc-100" />
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-zinc-900">{a.title}</p>
                          <p className="mt-0.5 line-clamp-1 max-w-md text-gray-text-4">
                            {a.body}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                        {ANNOUNCEMENT_TYPE_LABELS[a.type]}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-gray-text-4">
                      {a.type === "event" ? (
                        <>
                          <p className="whitespace-nowrap text-zinc-700">
                            {formatEventDates(a.event.startDate, a.event.endDate)}
                          </p>
                          <p className="mt-0.5 whitespace-nowrap">
                            {formatEventTimes(a.event.startTime, a.event.endTime)}
                          </p>
                          <p className="mt-0.5">{a.event.location}</p>
                        </>
                      ) : (
                        <p>By {a.author}</p>
                      )}
                    </td>
                    <td className="whitespace-nowrap py-3 pr-4 text-gray-text-4">
                      {formatPublished(a.publishedAt)}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(`/dashboard/announcements/${a.id}`)
                          }
                        >
                          <PenLine className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setPendingDelete(a)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Dialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <DialogContent className="p-8 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Delete this announcement?</DialogTitle>
            <DialogDescription>
              “{pendingDelete?.title}” will be removed from the app
              {pendingDelete?.bannerUrl ? ", and its banner image deleted" : ""}.
              This can’t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              size="xl"
              onClick={() => setPendingDelete(null)}
              disabled={deleteMut.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="xl"
              loading={deleteMut.isPending}
              onClick={confirmDelete}
            >
              <Trash2 className="h-4 w-4" />
              Delete announcement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ------------------------------------------------------------------ */

/** Dates come back as RFC3339; fall back to the raw value if unparseable. */
function formatPublished(value: string) {
  try {
    return format(parseISO(value), "d MMM yyyy, HH:mm");
  } catch {
    return value;
  }
}

function Th({ children }: { children?: React.ReactNode }) {
  return (
    <th className="pb-3 pr-4 text-[11px] font-semibold uppercase tracking-wide text-gray-text-4">
      {children}
    </th>
  );
}

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-14 animate-pulse rounded-xl border border-gray-1 bg-zinc-50"
        />
      ))}
    </div>
  );
}

function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-1 px-6 py-12 text-center">
      <Megaphone className="h-5 w-5 text-gray-text-4" />
      <p className="text-sm font-semibold text-zinc-900">{title}</p>
      <p className="max-w-sm text-sm text-gray-text-4">{body}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
