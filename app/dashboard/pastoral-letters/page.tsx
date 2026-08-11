"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { Mail, PenLine, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import {
  useDeletePastoralLetter,
  usePastoralLetters,
} from "./_hooks/usePastoralLetters";
import type { PastoralLetter } from "./_types";

export default function PastoralLettersPage() {
  const router = useRouter();
  const { data: letters, isLoading, isError, refetch } = usePastoralLetters();
  const [pendingDelete, setPendingDelete] = useState<PastoralLetter | null>(null);

  const deleteMut = useDeletePastoralLetter();

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const { id, title } = pendingDelete;
    deleteMut.mutate(id, {
      onSuccess: () => {
        toast.success(`“${title}” deleted`);
        setPendingDelete(null);
      },
      onError: (e) =>
        toast.error(e instanceof Error ? e.message : "Failed to delete letter"),
    });
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Pastoral Letters
          </h1>
          <p className="mt-1 text-sm text-gray-text-4">
            Publish letters from the Bishop. Publishing notifies every registered
            device.
          </p>
        </div>
        <Button
          size="xl"
          onClick={() => router.push("/dashboard/pastoral-letters/new")}
        >
          <Plus className="h-4 w-4" />
          New letter
        </Button>
      </div>

      <section className="rounded-2xl border border-gray-1 bg-white p-5 shadow-sm">
        {isLoading ? (
          <ListSkeleton />
        ) : isError ? (
          <EmptyState
            title="Couldn't load pastoral letters"
            body="Check that the API is running, then try again."
            action={
              <Button variant="outline" onClick={() => refetch()}>
                Retry
              </Button>
            }
          />
        ) : !letters || letters.length === 0 ? (
          <EmptyState
            title="No letters yet"
            body="Publish the first pastoral letter and it will appear in the app under “From the Bishop”."
            action={
              <Button
                onClick={() => router.push("/dashboard/pastoral-letters/new")}
              >
                <Plus className="h-4 w-4" />
                New letter
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-1">
                  <Th>Title</Th>
                  <Th>Author</Th>
                  <Th>Type</Th>
                  <Th>Published</Th>
                  <th className="pb-3" />
                </tr>
              </thead>
              <tbody>
                {letters.map((letter) => (
                  <tr
                    key={letter.id}
                    className="border-b border-gray-1 last:border-0"
                  >
                    <td className="py-3 pr-4">
                      <p className="font-semibold text-zinc-900">
                        {letter.title}
                      </p>
                      <p className="mt-0.5 line-clamp-1 max-w-md text-gray-text-4">
                        {letter.body}
                      </p>
                    </td>
                    <td className="py-3 pr-4 text-gray-text-4">
                      {[letter.author.title, letter.author.name]
                        .filter(Boolean)
                        .join(" ")}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium capitalize text-zinc-700">
                        {letter.letterType}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-gray-text-4">
                      {formatPublished(letter.publishedAt)}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/dashboard/pastoral-letters/${letter.id}`,
                            )
                          }
                        >
                          <PenLine className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setPendingDelete(letter)}
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
            <DialogTitle>Delete this letter?</DialogTitle>
            <DialogDescription>
              “{pendingDelete?.title}” will be removed from the app. Anyone
              already notified about it keeps the notification — deleting does not
              recall it.
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
              Delete letter
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
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-1 px-6 py-12 text-center",
      )}
    >
      <Mail className="h-5 w-5 text-gray-text-4" />
      <p className="text-sm font-semibold text-zinc-900">{title}</p>
      <p className="max-w-sm text-sm text-gray-text-4">{body}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
