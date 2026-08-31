const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
  JPY: "¥",
  CAD: "CA$",
  AUD: "A$",
};

export function formatCurrency(
  currency: string | null | undefined,
  price: number,
): string {
  const symbol =
    currencySymbols[currency?.toUpperCase() ?? ""] ?? currency ?? "";

  return `${symbol}${price.toFixed(2)}`;
}

export function getDaysLeft(
  dueDate: Date | string | number | null | undefined,
): string {
  if (!dueDate) return "Not provided";

  if (typeof dueDate === "number") {
    if (!Number.isInteger(dueDate)) return "Not provided";
    if (dueDate < 0) return "Overdue";
    if (dueDate === 0) return "Last day";

    return `${dueDate} ${dueDate === 1 ? "day" : "days"} left`;
  }

  const parsedDate = new Date(dueDate);

  if (Number.isNaN(parsedDate.getTime())) return "Not provided";

  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const dueDateStart = new Date(
    parsedDate.getFullYear(),
    parsedDate.getMonth(),
    parsedDate.getDate(),
  );
  const daysLeft = Math.round(
    (dueDateStart.getTime() - todayStart.getTime()) / 86_400_000,
  );

  if (daysLeft < 0) return "Overdue";
  if (daysLeft === 0) return "Last day";

  return `${daysLeft} ${daysLeft === 1 ? "day" : "days"} left`;
}

export type SubscriptionDateFormat =
  | "dd/mm/yyyy"
  | "dd/mm"
  | "month-day-time"
  | "month-day";

export function formatSubscriptionDate(
  date: Date | string | null | undefined,
  format: SubscriptionDateFormat = "dd/mm/yyyy",
): string {
  if (!date) return "Not provided";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "Not provided";

  const day = String(parsedDate.getDate()).padStart(2, "0");
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const monthName = parsedDate.toLocaleString("en-US", { month: "long" });

  if (format === "dd/mm") return `${day}/${month}`;
  if (format === "month-day") return `${monthName} ${parsedDate.getDate()}`;

  if (format === "month-day-time") {
    const hours = String(parsedDate.getHours()).padStart(2, "0");
    const minutes = String(parsedDate.getMinutes()).padStart(2, "0");

    return `${monthName} ${parsedDate.getDate()}: ${hours}:${minutes}`;
  }

  return `${day}/${month}/${parsedDate.getFullYear()}`;
}

export function getBillingStatus(
  billing: string,
): "per day" | "per week" | "per month" | "per year" {
  const normalizedBilling = billing.toLowerCase();

  if (normalizedBilling === "daily") return "per day";
  if (normalizedBilling === "weekly") return "per week";
  if (normalizedBilling === "monthly") return "per month";

  return "per year";
}

export function getSubscriptionStatus(
  dueDate: Date | string | null | undefined,
  paid: boolean,
): "Active" | "Inactive" {
  if (!dueDate) return "Active";

  const parsedDate = new Date(dueDate);

  if (Number.isNaN(parsedDate.getTime())) return "Active";

  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const dueDateStart = new Date(
    parsedDate.getFullYear(),
    parsedDate.getMonth(),
    parsedDate.getDate(),
  );

  const isExpired = dueDateStart.getTime() < todayStart.getTime();

  return isExpired && !paid ? "Inactive" : "Active";
}
