"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";

import { LetterForm } from "../_components/LetterForm";
import { useCreatePastoralLetter } from "../_hooks/usePastoralLetters";

export default function NewPastoralLetterPage() {
  const router = useRouter();
  const createMut = useCreatePastoralLetter();

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

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          New Pastoral Letter
        </h1>
        <p className="mt-1 text-sm text-gray-text-4">
          Compose a letter and publish it to the app.
        </p>
      </div>

      <LetterForm
        mode="create"
        saving={createMut.isPending}
        onSubmit={(payload) =>
          createMut.mutate(payload, {
            onSuccess: () => {
              toast.success("Letter published — notification sent");
              router.push("/dashboard/pastoral-letters");
            },
            onError: (e) =>
              toast.error(
                e instanceof Error ? e.message : "Failed to publish letter",
              ),
          })
        }
      />
    </div>
  );
}
