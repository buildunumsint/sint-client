"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { ChevronLeft, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/context/AuthContext";
import { createApiClientSecured } from "@/services/apiClient";

import { useLiturgicalDay } from "../_hooks/useLiturgy";
import type { LiturgicalDay, ReadingKind, ReadingSection } from "../_types";

const TEMPLATE: { kind: ReadingKind; label: string }[] = [
  { kind: "first", label: "First Reading" },
  { kind: "psalm", label: "Responsorial Psalm" },
  { kind: "second", label: "Second Reading" },
  { kind: "acclamation", label: "Gospel Acclamation" },
  { kind: "gospel", label: "Gospel" },
];

type SectionForm = {
  kind: ReadingKind;
  label: string;
  reference: string;
  heading: string;
  body: string;
  response: string;
  versesText: string; // psalm stanzas, separated by a blank line
};

function toForm(day: LiturgicalDay): SectionForm[] {
  return TEMPLATE.map((t) => {
    const existing = day.readings.find((r) => r.kind === t.kind);
    return {
      kind: t.kind,
      label: existing?.label || t.label,
      reference: existing?.reference || "",
      heading: existing?.heading || "",
      body: existing?.body || "",
      response: existing?.response || "",
      versesText: existing?.verses?.join("\n\n") || "",
    };
  });
}

const hasHeadingBody = (kind: ReadingKind) =>
  kind === "first" || kind === "second" || kind === "gospel";

export default function ReadingsEditorPage() {
  const params = useParams<{ date: string }>();
  // Trim any stray time component (e.g. from an old timestamp-style URL).
  const date = (params.date ?? "").slice(0, 10);
  const router = useRouter();

  const valid = /^\d{4}-\d{2}-\d{2}$/.test(date);
  const { data: day, isLoading, isError } = useLiturgicalDay(valid ? date : "");

  return (
    <div className="flex w-full flex-col gap-6">
      <button
        type="button"
        onClick={() => router.push("/dashboard/readings")}
        className="inline-flex w-fit items-center gap-1 text-sm font-medium text-gray-text-4 hover:text-zinc-900"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to calendar
      </button>

      {!valid ? (
        <Notice title="Invalid date" body="That date isn't a valid calendar date." />
      ) : isLoading ? (
        <FormSkeleton />
      ) : isError || !day ? (
        <Notice
          title="Day not in the calendar"
          body="This date hasn't been seeded yet. Run `make setupdb` (or `make seed`) on sint-server, then try again."
        />
      ) : (
        <ReadingsEditor day={day} date={date} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function ReadingsEditor({ day, date }: { day: LiturgicalDay; date: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { access_token, updateAccessToken } = useAuthContext();
  const apiClient = createApiClientSecured(access_token, updateAccessToken);

  const [sections, setSections] = useState<SectionForm[]>(() => toForm(day));
  const [reflectionTitle, setReflectionTitle] = useState(day.reflection?.title || "");
  const [reflectionBody, setReflectionBody] = useState(day.reflection?.body || "");

  const update = (idx: number, patch: Partial<SectionForm>) =>
    setSections((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));

  const buildReadings = (): ReadingSection[] =>
    sections
      .map((s): ReadingSection => {
        const base: ReadingSection = {
          kind: s.kind,
          label: s.label,
          reference: s.reference.trim(),
        };
        if (s.kind === "psalm") {
          const verses = s.versesText
            .split(/\n{2,}/)
            .map((v) => v.trim())
            .filter(Boolean);
          if (verses.length) base.verses = verses;
          if (s.response.trim()) base.response = s.response.trim();
          return base;
        }
        if (s.kind === "acclamation") {
          if (s.response.trim()) base.response = s.response.trim();
          return base;
        }
        if (s.heading.trim()) base.heading = s.heading.trim();
        if (s.body.trim()) base.body = s.body.trim();
        if (s.response.trim()) base.response = s.response.trim();
        return base;
      })
      // Drop entirely-empty sections (e.g. a weekday with no second reading).
      .filter((s) => s.reference || s.body || s.verses?.length || s.response);

  const saveMut = useMutation({
    mutationKey: ["set-readings", date],
    mutationFn: () => {
      const reflection =
        reflectionTitle.trim() || reflectionBody.trim()
          ? { title: reflectionTitle.trim(), body: reflectionBody.trim() }
          : null;
      return apiClient.put(`/liturgy/day/${date}/readings`, {
        readings: buildReadings(),
        reflection,
      });
    },
    onSuccess: (res) => {
      if (res.status) {
        toast.success("Readings saved");
        queryClient.invalidateQueries({ queryKey: ["liturgy"] });
        router.push("/dashboard/readings");
        return;
      }
      toast.error(res.message || "Failed to save readings");
    },
    onError: () => toast.error("Failed to save readings"),
  });

  const prettyDate = format(parseISO(date), "EEEE, d MMMM yyyy");

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          {day.readings.length > 0 ? "Edit Readings" : "Register Readings"}
        </h1>
        <p className="mt-1 text-sm text-gray-text-4">
          {prettyDate} • {day.celebration}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {sections.map((s, idx) => (
          <section
            key={s.kind}
            className="rounded-2xl border border-gray-1 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-zinc-900">{s.label}</h3>
              <span className="text-[11px] font-bold uppercase tracking-wide text-gray-text-4">
                {s.kind}
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-4">
              <Input
                label="Reference"
                value={s.reference}
                onChange={(e) => update(idx, { reference: e.target.value })}
                placeholder="e.g. Isaiah 55:10-11"
              />

              {hasHeadingBody(s.kind) ? (
                <>
                  <Input
                    label="Heading"
                    value={s.heading}
                    onChange={(e) => update(idx, { heading: e.target.value })}
                    placeholder="A Reading from the Book of the Prophet Isaiah"
                  />
                  <Textarea
                    label="Body"
                    rows={6}
                    value={s.body}
                    onChange={(v) => update(idx, { body: v })}
                    placeholder="Paragraphs separated by a blank line"
                  />
                </>
              ) : null}

              {s.kind === "psalm" ? (
                <Textarea
                  label="Verses (stanzas separated by a blank line)"
                  rows={6}
                  value={s.versesText}
                  onChange={(v) => update(idx, { versesText: v })}
                  placeholder={"Stanza one...\n\nStanza two..."}
                />
              ) : null}

              <Input
                label="Response"
                value={s.response}
                onChange={(e) => update(idx, { response: e.target.value })}
                placeholder="R. Thanks be to God."
              />
            </div>
          </section>
        ))}

        {/* Reflection */}
        <section className="rounded-2xl border border-gray-1 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-zinc-900">
            Daily Reflection
            <span className="ml-2 text-xs font-normal text-gray-text-4">(optional)</span>
          </h3>
          <div className="mt-4 flex flex-col gap-4">
            <Input
              label="Title"
              value={reflectionTitle}
              onChange={(e) => setReflectionTitle(e.target.value)}
              placeholder="The Father Who Runs to Meet Us"
            />
            <Textarea
              label="Reflection"
              rows={5}
              value={reflectionBody}
              onChange={setReflectionBody}
              placeholder="A short reflection on the day's readings..."
            />
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-gray-1 bg-white/80 py-4 backdrop-blur">
        <Button
          variant="outline"
          size="xl"
          onClick={() => router.push("/dashboard/readings")}
          disabled={saveMut.isPending}
        >
          Cancel
        </Button>
        <Button
          size="xl"
          loading={saveMut.isPending}
          onClick={() => saveMut.mutate()}
        >
          <Save className="h-4 w-4" />
          Save readings
        </Button>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */

function Textarea({
  label,
  value,
  onChange,
  rows = 5,
  placeholder,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
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
          "flex w-full rounded-lg border border-input-blur bg-[#F7F7F7] px-3 py-2 text-sm shadow-none transition-all",
          "focus:border-input focus:outline-none focus:ring-0",
        )}
      />
    </div>
  );
}

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
