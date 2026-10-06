"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { CalendarDays, Info, Mail, Save, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { formatEventDates } from "../_format";
import { useUploadAnnouncementBanner } from "../_hooks/useAnnouncements";
import {
  ANNOUNCEMENT_TYPE_LABELS,
  type Announcement,
  type AnnouncementType,
  type CreateAnnouncementPayload,
} from "../_types";
import { BannerField, type BannerValue } from "./BannerField";

export type AnnouncementFormValues = {
  type: AnnouncementType;
  title: string;
  body: string;
  banner: BannerValue;
  // Event
  dates: DateRange | undefined;
  startTime: string;
  endTime: string;
  location: string;
  address: string;
  // Letter
  author: string;
};

const EMPTY: AnnouncementFormValues = {
  type: "event",
  title: "",
  body: "",
  banner: { url: "", file: null },
  dates: undefined,
  startTime: "",
  endTime: "",
  location: "",
  address: "",
  author: "",
};

export function toFormValues(a: Announcement): AnnouncementFormValues {
  const base = {
    ...EMPTY,
    type: a.type,
    title: a.title,
    body: a.body,
    banner: { url: a.bannerUrl ?? "", file: null },
  };
  if (a.type === "letter") return { ...base, author: a.author };
  return {
    ...base,
    // parseISO, not new Date(): "YYYY-MM-DD" must land on local midnight.
    dates: {
      from: parseISO(a.event.startDate),
      to: a.event.endDate ? parseISO(a.event.endDate) : undefined,
    },
    startTime: a.event.startTime,
    endTime: a.event.endTime ?? "",
    location: a.event.location,
    address: a.event.address ?? "",
  };
}

/**
 * Builds the full payload for the form's type. Only that type's sub-shape is
 * sent — the server rejects event details on a letter and vice versa — and
 * every optional is sent as null when blank, because PUT is a full
 * replacement (null clears).
 */
export function toPayload(
  v: AnnouncementFormValues,
  bannerUrl: string,
): CreateAnnouncementPayload {
  const blankToNull = (s: string) => s.trim() || null;
  const from = v.dates?.from;
  const to = v.dates?.to;

  return {
    type: v.type,
    title: v.title.trim(),
    body: v.body.trim(),
    bannerUrl: blankToNull(bannerUrl),
    event:
      v.type === "event" && from
        ? {
            startDate: format(from, "yyyy-MM-dd"),
            endDate:
              to && to.getTime() !== from.getTime()
                ? format(to, "yyyy-MM-dd")
                : null,
            startTime: v.startTime,
            endTime: blankToNull(v.endTime),
            location: v.location.trim(),
            address: blankToNull(v.address),
          }
        : null,
    author: v.type === "letter" ? v.author.trim() : null,
  };
}

type Props = {
  mode: "create" | "edit";
  initial?: Announcement;
  saving: boolean;
  onSubmit: (payload: CreateAnnouncementPayload) => void;
};

export function AnnouncementForm({ mode, initial, saving, onSubmit }: Props) {
  const router = useRouter();
  const uploadMut = useUploadAnnouncementBanner();
  const [values, setValues] = useState<AnnouncementFormValues>(() =>
    initial ? toFormValues(initial) : EMPTY,
  );
  const [touched, setTouched] = useState(false);

  const set = <K extends keyof AnnouncementFormValues>(
    key: K,
    value: AnnouncementFormValues[K],
  ) => setValues((prev) => ({ ...prev, [key]: value }));

  const paragraphs = useMemo(
    () => values.body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean),
    [values.body],
  );

  const errors = useMemo(() => {
    const e: Partial<Record<keyof AnnouncementFormValues, string>> = {};
    if (!values.title.trim()) e.title = "A title is required.";
    if (!values.body.trim()) e.body = "The body is required.";
    if (values.type === "event") {
      if (!values.dates?.from) e.dates = "Pick the event date or date range.";
      if (!values.startTime) e.startTime = "A start time is required.";
      if (!values.location.trim()) e.location = "A location is required.";
    } else if (!values.author.trim()) {
      e.author = "An author is required.";
    }
    return e;
  }, [values]);

  const valid = Object.keys(errors).length === 0;
  const busy = saving || uploadMut.isPending;

  const err = (key: keyof AnnouncementFormValues) =>
    touched ? errors[key] : undefined;

  const submit = async () => {
    setTouched(true);
    if (!valid) return;

    let bannerUrl = values.banner.url;
    if (values.banner.file) {
      try {
        bannerUrl = await uploadMut.mutateAsync(values.banner.file);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to upload banner");
        return;
      }
      // Keep the uploaded URL so a retry after a failed save doesn't upload
      // (and orphan) the same image again.
      set("banner", { url: bannerUrl, file: null });
    }
    onSubmit(toPayload(values, bannerUrl));
  };

  return (
    <>
      <div className="flex items-start gap-3 rounded-2xl border border-gray-1 bg-zinc-50 p-4 text-zinc-700">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <p className="text-sm font-semibold">
            {mode === "create"
              ? "Publishing shows this in the app right away"
              : "Saving updates the announcement in the app"}
          </p>
          <p className="mt-0.5 text-sm opacity-90">
            Announcements appear under “Diocesan Announcements”. They don’t send a
            push notification.
          </p>
        </div>
      </div>

      <section className="rounded-2xl border border-gray-1 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-zinc-900">Type</h3>
        {mode === "create" ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <TypeOption
              selected={values.type === "event"}
              onSelect={() => set("type", "event")}
              icon={<CalendarDays className="h-5 w-5" />}
              title="Event"
              body="A date, time and place — retreats, Masses, gatherings."
            />
            <TypeOption
              selected={values.type === "letter"}
              onSelect={() => set("type", "letter")}
              icon={<Mail className="h-5 w-5" />}
              title="Letter"
              body="A message signed by its author — circulars, notices."
            />
          </div>
        ) : (
          <p className="mt-2 text-sm text-gray-text-4">
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
              {ANNOUNCEMENT_TYPE_LABELS[values.type]}
            </span>
            <span className="ml-2">
              The type can’t be changed after publishing.
            </span>
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-gray-1 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-zinc-900">Details</h3>

        <div className="mt-4 flex flex-col gap-4">
          <Field error={err("title")}>
            <Input
              label="Title"
              value={values.title}
              isInvalid={Boolean(err("title"))}
              onChange={(e) => set("title", e.target.value)}
              placeholder={
                values.type === "event"
                  ? "Diocesan Youth Retreat"
                  : "Notice on the Jubilee Year"
              }
            />
          </Field>

          {values.type === "event" ? (
            <>
              <Field error={err("dates")}>
                <DateRangeField
                  value={values.dates}
                  isInvalid={Boolean(err("dates"))}
                  onChange={(d) => set("dates", d)}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field error={err("startTime")}>
                  <Input
                    type="time"
                    label="Start time"
                    value={values.startTime}
                    isInvalid={Boolean(err("startTime"))}
                    onChange={(e) => set("startTime", e.target.value)}
                  />
                </Field>
                <Field>
                  <Input
                    type="time"
                    label="End time (optional)"
                    value={values.endTime}
                    onChange={(e) => set("endTime", e.target.value)}
                  />
                </Field>
              </div>

              <Field error={err("location")}>
                <Input
                  label="Location"
                  value={values.location}
                  isInvalid={Boolean(err("location"))}
                  onChange={(e) => set("location", e.target.value)}
                  placeholder="St. Mary’s Retreat Center"
                />
              </Field>
              <Input
                label="Address (optional)"
                value={values.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="11 Umukene Street, Ada George, Port Harcourt"
              />
            </>
          ) : (
            <Field error={err("author")}>
              <Input
                label="Author"
                value={values.author}
                isInvalid={Boolean(err("author"))}
                onChange={(e) => set("author", e.target.value)}
                placeholder="Rev. Fr. John Okafor, Chancellor"
              />
            </Field>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-1 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-zinc-900">
          Banner <span className="font-normal text-gray-text-4">(optional)</span>
        </h3>
        <div className="mt-4">
          <BannerField
            value={values.banner}
            onChange={(b) => set("banner", b)}
            disabled={busy}
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
              rows={12}
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
            {values.type === "letter"
              ? " The author’s name appears under the title; end the body with any sign-off you want shown."
              : ""}
          </p>
        </div>
      </section>

      <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-gray-1 bg-white/80 py-4 backdrop-blur">
        <Button
          variant="outline"
          size="xl"
          onClick={() => router.push("/dashboard/announcements")}
          disabled={busy}
        >
          Cancel
        </Button>
        <Button size="xl" loading={busy} onClick={submit}>
          {mode === "create" ? (
            <>
              <Send className="h-4 w-4" />
              Publish {ANNOUNCEMENT_TYPE_LABELS[values.type].toLowerCase()}
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save changes
            </>
          )}
        </Button>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */

function TypeOption({
  selected,
  onSelect,
  icon,
  title,
  body,
}: {
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors",
        selected
          ? "border-zinc-900 bg-zinc-50"
          : "border-gray-1 hover:border-zinc-400",
      )}
    >
      <span className={selected ? "text-zinc-900" : "text-gray-text-4"}>
        {icon}
      </span>
      <span>
        <span className="block text-sm font-semibold text-zinc-900">{title}</span>
        <span className="mt-0.5 block text-sm text-gray-text-4">{body}</span>
      </span>
    </button>
  );
}

function DateRangeField({
  value,
  onChange,
  isInvalid,
}: {
  value: DateRange | undefined;
  onChange: (d: DateRange | undefined) => void;
  isInvalid?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const from = value?.from;
  const to = value?.to;

  return (
    <div className="w-full">
      <label className="mb-2 block text-md font-semibold">Date</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="xl"
            aria-invalid={isInvalid || undefined}
            className={cn(
              "w-full justify-start font-normal",
              // Important: the outline variant's own border colour otherwise
              // wins, and the theme has no --color-destructive for the
              // variant's aria-invalid style to use.
              isInvalid && "border-error!",
              !from && "text-gray-text-4",
            )}
          >
            <CalendarDays className="h-4 w-4" />
            {from
              ? formatEventDates(
                  format(from, "yyyy-MM-dd"),
                  to ? format(to, "yyyy-MM-dd") : null,
                )
              : "Pick a date, or a start and end date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="range"
            selected={value}
            defaultMonth={from}
            numberOfMonths={2}
            onSelect={onChange}
          />
          <p className="border-t border-gray-1 px-3 py-2 text-xs text-gray-text-4">
            Click one day for a single-day event, or a start and end day for a
            range.
          </p>
        </PopoverContent>
      </Popover>
    </div>
  );
}

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
  value,
  onChange,
  rows = 5,
  placeholder,
  isInvalid,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  isInvalid?: boolean;
}) {
  return (
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
  );
}
