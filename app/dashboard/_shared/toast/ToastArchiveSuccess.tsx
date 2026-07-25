"use client";

import ToastInfoIcon from "@/app/dashboard/_shared/icons/ToastInfoIcon";
import type { CSSProperties } from "react";
import { toast } from "sonner";

const containerStyle: CSSProperties = {
  padding: "16px 24px",
  gap: "10px",
  background: "rgba(147, 51, 234, 0.2)",
  borderRadius: "10px",
};

export type ToastArchiveSuccessProps = {
  message: string;
};

export function ToastArchiveSuccess({ message }: ToastArchiveSuccessProps) {
  return (
    <div className="flex items-center" style={containerStyle}>
      <span className="text-sm font-medium text-zinc-900">{message}</span>
      <ToastInfoIcon />
    </div>
  );
}

export function toastArchiveSuccess(message: string) {
  toast.custom(() => <ToastArchiveSuccess message={message} />, {
    unstyled: true,
  });
}
