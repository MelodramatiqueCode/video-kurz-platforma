import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(priceCents: number, currency = "eur") {
  return new Intl.NumberFormat("sk-SK", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(priceCents / 100);
}

export function formatLessonCount(count: number) {
  if (count === 1) return "1 lekcia";
  if (count >= 2 && count <= 4) return `${count} lekcie`;
  return `${count} lekcií`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
