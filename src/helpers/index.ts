import { formatDistanceToNow } from "date-fns";

export function formatDate(timestamp: any) {
  if (timestamp) {
    const date = new Date(
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
    );
    const relativeTime = formatDistanceToNow(date, { addSuffix: true });
    return relativeTime;
  } else {
    return "Just now";
  }
}
