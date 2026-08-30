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

export function getDaysLeft(dueDate: Date | string | null | undefined): string {
  if (!dueDate) return "Not provided";

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

export function formatSubscriptionDate(
  date: Date | string | null | undefined,
): string {
  if (!date) return "Not provided";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "Not provided";

  const day = String(parsedDate.getDate()).padStart(2, "0");
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");

  return `${day}/${month}/${parsedDate.getFullYear()}`;
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
