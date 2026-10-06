/**
 * Diocesan announcement domain models.
 *
 * Mirrors the DTO returned by `GET /announcements` on sint-server. The two
 * kinds share a base and differ in one sub-shape: an event carries `event`
 * (and `author: null`), a letter carries `author` (and `event: null`) — so
 * code can switch on `type` and TypeScript narrows the rest.
 *
 * Event dates are "YYYY-MM-DD" and times "HH:MM" (24h). They are wall-clock
 * values at the venue, not instants: parse dates with date-fns `parseISO`
 * (local midnight), never `new Date("YYYY-MM-DD")` (UTC midnight, which
 * renders as the previous day west of Greenwich).
 */

export type AnnouncementType = "event" | "letter";

export interface AnnouncementEvent {
  startDate: string;
  /** Null for a single-day event. */
  endDate: string | null;
  startTime: string;
  endTime: string | null;
  location: string;
  address: string | null;
}

interface AnnouncementBase {
  id: string;
  title: string;
  /** Full text; paragraphs are separated by blank lines. */
  body: string;
  bannerUrl: string | null;
  publishedAt: string;
}

export interface EventAnnouncement extends AnnouncementBase {
  type: "event";
  event: AnnouncementEvent;
  author: null;
}

export interface LetterAnnouncement extends AnnouncementBase {
  type: "letter";
  event: null;
  author: string;
}

export type Announcement = EventAnnouncement | LetterAnnouncement;

/**
 * Editable content, shared by create and update.
 *
 * `PUT /announcements/:id` is a full replacement, not a patch: a null
 * `bannerUrl`, `endDate`, `endTime` or `address` clears it. Always send the
 * whole form.
 */
export interface AnnouncementContentPayload {
  title: string;
  body: string;
  bannerUrl: string | null;
  event: AnnouncementEvent | null;
  author: string | null;
}

/** Payload for `POST /announcements`. */
export interface CreateAnnouncementPayload extends AnnouncementContentPayload {
  type: AnnouncementType;
}

/**
 * Payload for `PUT /announcements/:id`. The type cannot change; it may be
 * sent (so the create payload can be reused) but must match the stored one.
 */
export type UpdateAnnouncementPayload = AnnouncementContentPayload & {
  type?: AnnouncementType;
};

export const ANNOUNCEMENT_TYPE_LABELS: Record<AnnouncementType, string> = {
  event: "Event",
  letter: "Letter",
};

/**
 * Banner constraints. The mobile design renders the banner full-width at
 * 390×320pt, so 3x (1170×960px) is sharp on every phone and 2x is the
 * floor before it looks soft. The server enforces only type and size; the
 * dimension guidance is advisory and checked here.
 */
export const BANNER = {
  maxBytes: 2 * 1024 * 1024,
  mimeTypes: ["image/jpeg", "image/png", "image/webp"],
  recommended: { width: 1170, height: 960 },
  minimum: { width: 780, height: 640 },
  /** Design frame, in points. */
  frame: { width: 390, height: 320 },
} as const;
