"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Info, Save, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import {
  LETTER_TYPE_OPTIONS,
  type CreateLetterPayload,
  type LetterType,
  type PastoralLetter,
} from "../_types";

export type LetterFormValues = {
  title: string;
  authorTitle: string;
  authorName: string;
  letterType: LetterType;
  body: string;
  imageUrl: string;
};

const EMPTY: LetterFormValues = {
  title: "",
  authorTitle: "",
  authorName: "",
  letterType: "pastoral",
  body: "",
  imageUrl: "",
};

export function toFormValues(letter: PastoralLetter): LetterFormValues {
  return {
    title: letter.title,
    authorTitle: letter.author.title,
    authorName: letter.author.name,
    letterType: letter.letterType,
    body: letter.body,
    imageUrl: letter.imageUrl ?? "",
  };
}

/**
 * Always sends `imageUrl` as a (possibly empty) string rather than null.
 *
 * The server distinguishes the two on update: an absent/null field means
 * "leave untouched", while an empty string means "clear it". Sending null for
 * a cleared field would make the image URL unremovable. On create, the server
 * normalises an empty string to NULL.
 */
export function toPayload(v: LetterFormValues): CreateLetterPayload {
  return {
    title: v.title.trim(),
    authorTitle: v.authorTitle.trim(),
    authorName: v.authorName.trim(),
    letterType: v.letterType,
    body: v.body.trim(),
    imageUrl: v.imageUrl.trim(),
  };
}

type Props = {
  mode: "create" | "edit";
  initial?: PastoralLetter;
  saving: boolean;
  onSubmit: (payload: CreateLetterPayload) => void;
};

export function LetterForm({ mode, initial, saving, onSubmit }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<LetterFormValues>(() =>
    initial ? toFormValues(initial) : EMPTY,
  );
  const [touched, setTouched] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const set = <K extends keyof LetterFormValues>(
    key: K,
    value: LetterFormValues[K],
  ) => setValues((prev) => ({ ...prev, [key]: value }));

  // The blank-line paragraph convention is invisible in a textarea, so show
  // the author what the mobile app will actually render.
  const paragraphs = useMemo(
    () => values.body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean),
    [values.body],
  );

  const errors = useMemo(() => {
    const e: Partial<Record<keyof LetterFormValues, string>> = {};
    if (!values.title.trim()) e.title = "A title is required.";
    if (!values.authorTitle.trim()) e.authorTitle = "An author title is required.";
    if (!values.authorName.trim()) e.authorName = "An author name is required.";
    if (!values.body.trim()) e.body = "The letter body is required.";
    return e;
  }, [values]);

  const valid = Object.keys(errors).length === 0;

  const attemptSubmit = () => {
    setTouched(true);
    if (!valid) return;
    // Publishing broadcasts to every registered device and cannot be undone,
    // so creates get an explicit confirmation. Edits never re-notify.
    if (mode === "create") {
      setConfirmOpen(true);
      return;
    }
    onSubmit(toPayload(values));
  };

  const err = (key: keyof LetterFormValues) =>
    touched ? errors[key] : undefined;

  return (
    <>
      {mode === "create" ? (
        <Banner
          tone="warn"
          icon={<AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />}
          title="Publishing sends a notification to every registered device"
          body="The push goes out as soon as you publish, to the whole diocese, and cannot be recalled. Check the title and author before continuing."
        />
      ) : (
        <Banner
          tone="info"
          icon={<Info className="mt-0.5 h-4 w-4 shrink-0" />}
          title="Editing does not re-send the notification"
          body="Saving updates the letter in the app. Everyone who was notified when it was first published will not be notified again."
        />
      )}

      <section className="rounded-2xl border border-gray-1 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-zinc-900">Letter details</h3>

        <div className="mt-4 flex flex-col gap-4">
          <Field error={err("title")}>
            <Input
              label="Title"
              value={values.title}
              isInvalid={Boolean(err("title"))}
              onChange={(e) => set("title", e.target.value)}
              placeholder="A Season of Grace"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field error={err("authorTitle")}>
              <Input
                label="Author title"
                value={values.authorTitle}
                isInvalid={Boolean(err("authorTitle"))}
                onChange={(e) => set("authorTitle", e.target.value)}
                placeholder="Most Rev."
              />
            </Field>
            <Field error={err("authorName")}>
              <Input
                label="Author name"
                value={values.authorName}
                isInvalid={Boolean(err("authorName"))}
                onChange={(e) => set("authorName", e.target.value)}
                placeholder="John Doe"
              />
            </Field>
          </div>

          <div className="w-full">
            <label className="mb-2 block text-md font-semibold">
              Letter type
            </label>
            <Select
              value={values.letterType}
              onValueChange={(v) => set("letterType", v as LetterType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Letter type" />
              </SelectTrigger>
              <SelectContent>
                {LETTER_TYPE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Input
            label="Image URL (optional)"
            value={values.imageUrl}
            onChange={(e) => set("imageUrl", e.target.value)}
            placeholder="https://…"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-gray-1 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-zinc-900">Body</h3>
          <span className="text-xs text-gray-text-4">
            {paragraphs.length} paragraph{paragraphs.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="mt-4">
          <Field error={err("body")}>
            <Textarea
              rows={16}
              value={values.body}
              isInvalid={Boolean(err("body"))}
              onChange={(v) => set("body", v)}
              placeholder={
                "Separate paragraphs with a blank line.\n\nLike this — each block becomes its own paragraph in the app."
              }
            />
          </Field>
          <p className="mt-2 text-xs text-gray-text-4">
            Paragraphs are split on blank lines. A single line break stays inside
            the same paragraph.
          </p>
        </div>
      </section>

      <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-gray-1 bg-white/80 py-4 backdrop-blur">
        <Button
          variant="outline"
          size="xl"
          onClick={() => router.push("/dashboard/pastoral-letters")}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button size="xl" loading={saving} onClick={attemptSubmit}>
          {mode === "create" ? (
            <>
              <Send className="h-4 w-4" />
              Publish letter
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save changes
            </>
          )}
        </Button>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="p-8 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Publish and notify the diocese?</DialogTitle>
            <DialogDescription>
              Every device registered for notifications will receive “
              {values.title.trim() || "Untitled"}” from{" "}
              {[values.authorTitle.trim(), values.authorName.trim()]
                .filter(Boolean)
                .join(" ") || "the author"}
              . This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              size="xl"
              onClick={() => setConfirmOpen(false)}
              disabled={saving}
            >
              Go back
            </Button>
            <Button
              size="xl"
              loading={saving}
              onClick={() => {
                setConfirmOpen(false);
                onSubmit(toPayload(values));
              }}
            >
              <Send className="h-4 w-4" />
              Publish and notify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ------------------------------------------------------------------ */

function Field({
  error,
  children,
}: {
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      {children}
      {error ? <p className="mt-1 text-xs text-error">{error}</p> : null}
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  rows = 5,
  placeholder,
  isInvalid,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  isInvalid?: boolean;
}) {
  return (
    <div className="w-full">
      {label ? (
        <label className="mb-2 block text-md font-semibold">{label}</label>
      ) : null}
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "flex w-full rounded-lg border bg-[#F7F7F7] px-3 py-2 text-sm shadow-none transition-all",
          "focus:outline-none focus:ring-0",
          isInvalid ? "border-error" : "border-input-blur focus:border-input",
        )}
      />
    </div>
  );
}

function Banner({
  tone,
  icon,
  title,
  body,
}: {
  tone: "warn" | "info";
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border p-4",
        tone === "warn"
          ? "border-amber-200 bg-amber-50 text-amber-900"
          : "border-gray-1 bg-zinc-50 text-zinc-700",
      )}
    >
      {icon}
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-0.5 text-sm opacity-90">{body}</p>
      </div>
    </div>
  );
}
