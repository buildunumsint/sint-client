"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, RefreshCw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * What an image slot expects, and why. The server enforces only type and size
 * (see `api/media` in sint-server); the dimension guidance is advisory and
 * checked here, since a small or oddly-shaped image still works — it's just
 * soft or cropped.
 */
export type ImageSpec = {
  /** Lowercase name used in the copy: "banner", "image". */
  noun: string;
  maxBytes: number;
  mimeTypes: readonly string[];
  /** Sharp on every phone: the frame at 3x. */
  recommended: { readonly width: number; readonly height: number };
  /** The floor before it looks soft: the frame at 2x. */
  minimum: { readonly width: number; readonly height: number };
  /** The design frame, in points. Its aspect ratio drives the preview and the crop warning. */
  frame: { readonly width: number; readonly height: number };
  /** The frame's ratio as an admin would say it, e.g. "39:32". */
  ratioLabel: string;
  /** Where the recommended size comes from, e.g. "the app’s 390 × 320 frame at 3×". */
  recommendedNote: string;
  /** Composition advice: what to keep clear of the crop. */
  cropNote: string;
};

export type ImageValue = {
  /** The stored image's URL, or "" for none. */
  url: string;
  /** A newly picked file, uploaded on submit. Takes precedence over `url`. */
  file: File | null;
};

type Dimensions = { width: number; height: number };

type Props = {
  spec: ImageSpec;
  value: ImageValue;
  onChange: (next: ImageValue) => void;
  disabled?: boolean;
};

const MB = 1024 * 1024;

/**
 * Picks, previews and checks an image before upload.
 *
 * The preview is drawn at the design's real size with `object-cover`, so the
 * admin sees the crop parishioners will. Type and size are hard limits (the
 * server rejects them anyway); low resolution and an off aspect ratio are
 * warnings.
 *
 * Nothing is uploaded here. The picked file rides in `value.file` and the
 * form uploads it on submit, so an abandoned form leaves nothing in R2.
 */
export function ImageField({ spec, value, onChange, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dims, setDims] = useState<Dimensions | null>(null);

  const aspect = spec.frame.width / spec.frame.height;
  const maxMb = spec.maxBytes / MB;
  const Noun = spec.noun.charAt(0).toUpperCase() + spec.noun.slice(1);

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

    if (!spec.mimeTypes.includes(file.type)) {
      setError("Use a JPEG, PNG or WebP image.");
      return;
    }
    if (file.size > spec.maxBytes) {
      setError(
        `That image is ${(file.size / MB).toFixed(1)} MB — the limit is ${maxMb} MB. Export it at ${spec.recommended.width}×${spec.recommended.height} or compress it.`,
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

  const warnings = dims ? dimensionWarnings(dims, spec, aspect) : [];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-start gap-5">
        <div
          className={cn(
            "relative flex w-full items-center justify-center overflow-hidden rounded-2xl border bg-zinc-50",
            src ? "border-gray-1" : "border-dashed border-gray-1",
          )}
          style={{
            maxWidth: spec.frame.width,
            aspectRatio: `${spec.frame.width} / ${spec.frame.height}`,
          }}
        >
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element -- blob: previews and arbitrary R2 hosts; next/image would need remotePatterns for both
            <img
              src={src}
              alt={`${Noun} preview`}
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
              <span className="text-sm font-medium">Add a {spec.noun}</span>
              <span className="text-xs">
                {spec.recommended.width} × {spec.recommended.height} px
              </span>
            </button>
          )}
        </div>

        <div className="flex min-w-[220px] flex-1 flex-col gap-3">
          <ul className="flex flex-col gap-1 text-xs text-gray-text-4">
            <li>
              <span className="font-semibold text-zinc-700">
                {spec.recommended.width} × {spec.recommended.height} px
              </span>{" "}
              recommended ({spec.ratioLabel} — {spec.recommendedNote})
            </li>
            <li>
              At least {spec.minimum.width} × {spec.minimum.height} px, or it
              will look soft on most phones
            </li>
            <li>
              JPEG, PNG or WebP · up to {maxMb} MB (JPEG/WebP usually ~200 KB)
            </li>
            <li>{spec.cropNote}</li>
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
        accept={spec.mimeTypes.join(",")}
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

function dimensionWarnings(
  { width, height }: Dimensions,
  spec: ImageSpec,
  aspect: number,
): string[] {
  const out: string[] = [];
  if (width < spec.minimum.width || height < spec.minimum.height) {
    out.push(
      `This image is ${width} × ${height} px — below ${spec.minimum.width} × ${spec.minimum.height}, so it will look blurry on most phones.`,
    );
  }
  // More than ~10% off the frame's ratio means a visible crop on one axis.
  const ratio = width / height;
  if (Math.abs(ratio - aspect) / aspect > 0.1) {
    const side = ratio > aspect ? "left and right" : "top and bottom";
    out.push(
      `The image isn’t ${spec.ratioLabel}, so the app will crop its ${side} edges. Check the preview above.`,
    );
  }
  return out;
}
