import { format, parseISO } from "date-fns";

/**
 * "March 15, 2024", "March 15 – 17, 2024", "March 30 – April 2, 2024" or
 * "December 30, 2024 – January 2, 2025". Must match the mobile app's
 * formatter so the admin sees what parishioners will.
 */
export function formatEventDates(startDate: string, endDate?: string | null) {
  const start = parseISO(startDate);
  if (!endDate || endDate === startDate) return format(start, "MMMM d, yyyy");

  const end = parseISO(endDate);
  if (start.getFullYear() !== end.getFullYear()) {
    return `${format(start, "MMMM d, yyyy")} – ${format(end, "MMMM d, yyyy")}`;
  }
  if (start.getMonth() !== end.getMonth()) {
    return `${format(start, "MMMM d")} – ${format(end, "MMMM d, yyyy")}`;
  }
  return `${format(start, "MMMM d")} – ${format(end, "d, yyyy")}`;
}

/** "16:00" → "4:00 PM". */
export function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return format(new Date(2000, 0, 1, h, m), "h:mm a");
}

/** "4:00 PM" or "4:00 PM – 12:00 PM". */
export function formatEventTimes(startTime: string, endTime?: string | null) {
  return endTime
    ? `${formatTime(startTime)} – ${formatTime(endTime)}`
    : formatTime(startTime);
}
