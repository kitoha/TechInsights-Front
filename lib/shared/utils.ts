import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatCompactNumber(value: number): string {
  if (value >= 1000000) {
    const formatted = (value / 1000000).toFixed(1);
    return `${formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted}M`;
  }
  if (value >= 1000) {
    const formatted = (value / 1000).toFixed(1);
    if (formatted === '1000.0') {
      return '1M';
    }
    return `${formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted}k`;
  }
  return value.toString();
}
