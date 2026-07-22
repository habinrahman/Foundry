export function createFormatters(intlLocale: string) {
  const formatDate = (
    value: Date | string | number,
    options?: Intl.DateTimeFormatOptions
  ) =>
    new Intl.DateTimeFormat(intlLocale, {
      dateStyle: "long",
      ...options,
    }).format(
      typeof value === "string" || typeof value === "number"
        ? new Date(value)
        : value
    );

  const formatNumber = (value: number, options?: Intl.NumberFormatOptions) =>
    new Intl.NumberFormat(intlLocale, options).format(value);

  /** Contract: value is 0–100 (e.g. ATS 95 → ٩٥٪). */
  const formatPercent = (value: number) =>
    new Intl.NumberFormat(intlLocale, {
      style: "percent",
      maximumFractionDigits: 0,
    }).format(value / 100);

  return { formatDate, formatNumber, formatPercent };
}
