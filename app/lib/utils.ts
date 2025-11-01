export function applyPersistedToFormData(
  fd: FormData,
  data: Record<string, any>
) {
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v === null) continue;
    // Si no es string, lo guardamos como JSON (útil para arrays/objetos)
    fd.set(k, typeof v === "string" ? v : JSON.stringify(v));
  }
}

export const formatCurrency = (amount: number): string => {
  // Validar que amount sea un número válido
  if (isNaN(amount) || amount === null || amount === undefined) {
    return "$0.00";
  }

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatCurrencyCompact = (amount: number): string => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return "$0";
  }

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
    notation: "compact",
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("es-MX").format(num);
};

export const truncate = (text: string, max: number) => {
  return text.length > max ? text.slice(0, max) + "..." : text;
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = "en-US"
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const generateYAxis = (revenue: { revenue: number }[]) => {
  // Calcular el máximo valor
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= topLabel / 10) {
    yAxisLabels.push(i);
  }

  return { yAxisLabels, topLabel };
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};
