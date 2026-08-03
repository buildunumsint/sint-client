"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";

import { LetterForm } from "../_components/LetterForm";
import {
  usePastoralLetter,
  useUpdatePastoralLetter,
} from "../_hooks/usePastoralLetters";

export default function EditPastoralLetterPage() {
  const params = useParams<{ id: string }>();
  const id = params.id ?? "";
  const router = useRouter();

  const { data: letter, isLoading, isError } = usePastoralLetter(id);
  const updateMut = useUpdatePastoralLetter(id);

  return (
    <div className="flex w-full flex-col gap-6">
      <button
        type="button"
        onClick={() => router.push("/dashboard/pastoral-letters")}
        className="inline-flex w-fit items-center gap-1 text-sm font-medium text-gray-text-4 hover:text-zinc-900"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to pastoral letters
      </button>

      {isLoading ? (
        <FormSkeleton />
      ) : isError || !letter ? (
        <Notice
          title="Letter not found"
          body="This letter may have been deleted. Go back to the list and try again."
        />
      ) : (
        <>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              Edit Pastoral Letter
            </h1>
            <p className="mt-1 text-sm text-gray-text-4">{letter.title}</p>
          </div>

          {/* `initial` seeds form state once; the form owns it from then on, so
              a background refetch can't clobber in-progress edits. */}
          <LetterForm
            mode="edit"
            initial={letter}
            saving={updateMut.isPending}
            onSubmit={(payload) =>
              updateMut.mutate(payload, {
                onSuccess: () => {
                  toast.success("Letter saved");
                  router.push("/dashboard/pastoral-letters");
                },
                onError: (e) =>
                  toast.error(
                    e instanceof Error ? e.message : "Failed to save letter",
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
