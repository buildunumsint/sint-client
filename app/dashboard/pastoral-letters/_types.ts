/**
 * Pastoral letter domain models.
 *
 * Mirrors the DTO returned by `GET /pastoral-letters` on sint-server, which
 * nests the author even though the columns are flat (author_title /
 * author_name) — so the wire contract survives the author moving to its own
 * record later.
 */

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
