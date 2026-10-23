/**
 * Pastoral letter domain models.
 *
 * Mirrors the DTO returned by `GET /pastoral-letters` on sint-server, which
 * nests the author even though the columns are flat (author_title /
 * author_name) — so the wire contract survives the author moving to its own
 * record later.
 */

import type { ImageSpec } from "@/components/ImageField";

export type LetterType = "pastoral" | "general";

export interface LetterAuthor {
  title: string;
  name: string;
}

export interface PastoralLetter {
  id: string;
  title: string;
  author: LetterAuthor;
  /** Full text; paragraphs are separated by blank lines. */
  body: string;
  letterType: LetterType;
  imageUrl?: string | null;
  publishedAt: string;
}

/** Payload for `POST /pastoral-letters`. */
export interface CreateLetterPayload {
  title: string;
  authorTitle: string;
  authorName: string;
  body: string;
  letterType: LetterType;
  imageUrl?: string | null;
  publishedAt?: string;
}

/**
 * Payload for `PUT /pastoral-letters/:id`. Every field is optional server-side
 * (omitted keys are left untouched), so a partial edit needs no full read.
 */
export type UpdateLetterPayload = Partial<CreateLetterPayload>;

export const LETTER_TYPE_OPTIONS: { value: LetterType; label: string }[] = [
  { value: "pastoral", label: "Pastoral letter" },
  { value: "general", label: "General letter" },
];

/**
 * A letter's image is shown twice in the app, from the same file: as the
 * Diocese tab's hero card (a 350×260pt frame on a 390pt phone — the preview
 * here) and as a wide 147pt-tall strip on the letter's own page, cropped from
 * the middle. The server enforces only type and size; the rest is advisory.
 */
export const LETTER_IMAGE: ImageSpec = {
  noun: "image",
  maxBytes: 2 * 1024 * 1024,
  mimeTypes: ["image/jpeg", "image/png", "image/webp"],
  recommended: { width: 1050, height: 780 },
  minimum: { width: 700, height: 520 },
  frame: { width: 350, height: 260 },
  ratioLabel: "4:3",
  recommendedNote: "the Diocese tab’s 350 × 260 card at 3×",
  cropNote:
    "Keep faces and text near the centre — the letter page crops it to a wide strip",
};
