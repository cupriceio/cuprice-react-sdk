const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

export const normalizeHex = (candidate: string | null, fallback: string): string => {
  if (candidate && HEX_COLOR_REGEX.test(candidate.trim())) {
    return candidate.trim().toUpperCase();
  }
  return fallback;
};

export const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
  };
  return symbols[currency] || '$';
};

export const formatPrice = (price: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

