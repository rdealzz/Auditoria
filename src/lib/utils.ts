import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(
    typeof value === "string" ? new Date(value) : value,
  );
}

export function formatDateLong(value: string | Date) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(
    typeof value === "string" ? new Date(value) : value,
  );
}

export function formatPercent(value: number, digits = 1) {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value / 100);
}

/** Dias entre hoje e a data informada. Negativo = vencido. */
export function daysUntil(value: string | Date) {
  const target = typeof value === "string" ? new Date(value) : value;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / 86_400_000);
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter((part) => part.length > 2 || part === name.split(" ")[0])
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
