// Single source of truth for rendering customer-facing prices.
// Backend returns prices already converted to DISPLAY_CURRENCY
// (EUR by default), so this just adds the right symbol.
export const fmtPrice = (amount: number, currency: string): string => {
  try {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
};
