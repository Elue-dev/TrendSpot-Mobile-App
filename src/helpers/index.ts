import { format, formatDistanceToNow } from "date-fns";

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return format(date, "MMMM dd, yyyy");
}

export function formatTimeAgo(dateString: string | Date) {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
}

export function formatShortTime(dateString: string) {
  const date = new Date(dateString);
  const distance = formatDistanceToNow(date, { addSuffix: true });

  const [value, unit] = distance.split(" ");

  const abbreviations: Record<string, string> = {
    years: "yr",
    year: "yr",
    months: "mo",
    month: "mo",
    weeks: "wk",
    week: "wk",
    days: "d",
    day: "d",
    hours: "hr",
    hour: "hr",
    minutes: "min",
    minute: "min",
    seconds: "sec",
    second: "sec",
  };

  const abbreviatedUnit = abbreviations[unit] || unit;

  return `${value}${abbreviatedUnit}`;
}
