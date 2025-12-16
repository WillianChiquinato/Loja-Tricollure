export const formatCurrency = (
  value: number,
  locale = "pt-BR",
  currency = "BRL"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
};

export const formatDate = (
  date: Date | string,
  locale = "pt-BR",
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
};

export const formatPercentage = (value: number, locale = "pt-BR"): string => {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatNumber = (
  value: number,
  locale = "pt-BR",
  options: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }
): string => {
  return new Intl.NumberFormat(locale, options).format(value);
};

export const formatSemJuros = (price: number, installments: number): string => {
  const installmentValue = price / installments;
  return `${installments}x de ${formatCurrency(installmentValue)} sem juros`;
};
