"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, RefreshCw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { BANNER } from "../_types";

export type BannerValue = {
  /** The stored banner's URL, or "" for none. */
  url: string;
  /** A newly picked file, uploaded on submit. Takes precedence over `url`. */
  file: File | null;
};

type Dimensions = { width: number; height: number };

type Props = {
  value: BannerValue;
  onChange: (next: BannerValue) => void;
  disabled?: boolean;
};

const MB = 1024 * 1024;
const ASPECT = BANNER.frame.width / BANNER.frame.height;

/**
 * Picks, previews and checks a banner before upload.
 *
 * The preview is drawn at the design's real size (390×320 CSS px ≈ the
 * phone's 390×320pt frame) with `object-cover`, so the admin sees exactly
 * the crop parishioners will. Type and size are hard limits (the server
 * rejects them anyway); low resolution and an off aspect ratio are warnings,
 * since the image still works — it's just soft or cropped.
 */
export function BannerField({ value, onChange, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dims, setDims] = useState<Dimensions | null>(null);

  const previewUrl = useMemo(
    () => (value.file ? URL.createObjectURL(value.file) : null),
    [value.file],
  );
  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  const src = previewUrl ?? (value.url || null);

  const pick = async (file: File | undefined) => {
    // Reset so picking the same file again still fires onChange.
    if (inputRef.current) inputRef.current.value = "";
    if (!file) return;

    if (!(BANNER.mimeTypes as readonly string[]).includes(file.type)) {
      setError("Use a JPEG, PNG or WebP image.");
      return;
    }
    if (file.size > BANNER.maxBytes) {
      setError(
        `That image is ${(file.size / MB).toFixed(1)} MB — the limit is 2 MB. Export it at ${BANNER.recommended.width}×${BANNER.recommended.height} or compress it.`,
      );
      return;
    }

    setError(null);
    setDims(null);
    onChange({ url: value.url, file });
    setDims(await readDimensions(file));
  };

  const remove = () => {
    setError(null);
    setDims(null);
    onChange({ url: "", file: null });
  };

  const warnings = dims ? dimensionWarnings(dims) : [];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-start gap-5">
        <div
          className={cn(
            "relative flex w-full max-w-[390px] items-center justify-center overflow-hidden rounded-2xl border bg-zinc-50",
            src ? "border-gray-1" : "border-dashed border-gray-1",
          )}
          style={{ aspectRatio: `${BANNER.frame.width} / ${BANNER.frame.height}` }}
        >
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element -- blob: previews and arbitrary R2 hosts; next/image would need remotePatterns for both
            <img
              src={src}
              alt="Banner preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <button
              type="button"
              disabled={disabled}
              onClick={() => inputRef.current?.click()}
              className="flex h-full w-full flex-col items-center justify-center gap-2 text-gray-text-4 hover:text-zinc-900"
            >
              <ImagePlus className="h-6 w-6" />
              <span className="text-sm font-medium">Add a banner</span>
              <span className="text-xs">
                {BANNER.recommended.width} × {BANNER.recommended.height} px
              </span>
            </button>
          )}
        </div>

        <div className="flex min-w-[220px] flex-1 flex-col gap-3">
          <ul className="flex flex-col gap-1 text-xs text-gray-text-4">
            <li>
              <span className="font-semibold text-zinc-700">
                {BANNER.recommended.width} × {BANNER.recommended.height} px
              </span>{" "}
              recommended (39:32 — the app’s 390 × 320 frame at 3×)
            </li>
            <li>
              At least {BANNER.minimum.width} × {BANNER.minimum.height} px, or
              it will look soft on most phones
            </li>
            <li>JPEG, PNG or WebP · up to 2 MB (JPEG/WebP usually ~200 KB)</li>
            <li>
              Keep text and faces near the centre — the home feed shows a square
              crop
            </li>
          </ul>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              onClick={() => inputRef.current?.click()}
            >
              {src ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5" />
                  Replace
                </>
              ) : (
                <>
                  <ImagePlus className="h-3.5 w-3.5" />
                  Choose image
                </>
              )}
            </Button>
            {src ? (
              <Button
                type="button"
                variant="destructive"
                disabled={disabled}
                onClick={remove}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </Button>
            ) : null}
          </div>

          {value.file ? (
            <p className="text-xs text-gray-text-4">
              {value.file.name} · {formatBytes(value.file.size)}
              {dims ? ` · ${dims.width} × ${dims.height} px` : ""} — uploads when
              you save
            </p>
          ) : null}
        </div>
      </div>

      {error ? <p className="text-xs text-error">{error}</p> : null}
      {warnings.map((w) => (
        <p key={w} className="text-xs text-amber-700">
          {w}
        </p>
      ))}

      <input
        ref={inputRef}
        type="file"
        accept={BANNER.mimeTypes.join(",")}
        className="hidden"
        onChange={(e) => pick(e.target.files?.[0])}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function formatBytes(bytes: number) {
  return bytes < MB
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / MB).toFixed(1)} MB`;
}

function readDimensions(file: File): Promise<Dimensions | null> {
  return createImageBitmap(file)
    .then((bmp) => {
      const d = { width: bmp.width, height: bmp.height };
      bmp.close();
      return d;
    })
    .catch(() => null);
}

function dimensionWarnings({ width, height }: Dimensions): string[] {
  const out: string[] = [];
  if (width < BANNER.minimum.width || height < BANNER.minimum.height) {
    out.push(
      `This image is ${width} × ${height} px — below ${BANNER.minimum.width} × ${BANNER.minimum.height}, so it will look blurry on most phones.`,
    );
  }
  // More than ~10% off 39:32 means a visible crop on one axis.
  const ratio = width / height;
  if (Math.abs(ratio - ASPECT) / ASPECT > 0.1) {
    const side = ratio > ASPECT ? "left and right" : "top and bottom";
    out.push(
      `The image isn’t 39:32, so the app will crop its ${side} edges. Check the preview above.`,
    );
  }
  return out;
}
