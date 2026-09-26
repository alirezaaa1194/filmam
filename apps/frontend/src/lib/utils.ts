import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function movieLikePercentCalc(likesCount: number, dislikesCount: number) {
  const total = likesCount + dislikesCount;
  return (total === 0 ? 0 : likesCount > dislikesCount ? (likesCount / total) * 100 : 0).toFixed(0);
}
export function formatDuration(
  durationInSeconds: number,
  label: {
    second: string;
    minute: string;
    hour: string;
  },
) {
  const totalSeconds = Math.max(0, Math.floor(durationInSeconds));

  if (totalSeconds < 60) {
    return `${totalSeconds} ${label.second}`;
  }

  const totalMinutes = Math.floor(totalSeconds / 60);

  if (totalMinutes < 60) {
    return `${totalMinutes} ${label.minute}`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes < 5) {
    return `${hours} ${label.hour}`;
  }

  return `${hours} ${label.hour} ${minutes} ${label.minute}`;
}
