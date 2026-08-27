const browserLocale = navigator.language || "en-US";

const currencyFormatter = new Intl.NumberFormat(browserLocale, {
  style: "currency",
  currency: "USD",
});

export const formatter = (numero: number): string => {
  return currencyFormatter.format(numero);
};
