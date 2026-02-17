const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

export const normalizeHex = (candidate: string | null, fallback: string): string => {
  if (candidate && HEX_COLOR_REGEX.test(candidate.trim())) {
    return candidate.trim().toUpperCase();
  }
  return fallback;
};

export const normalizeColor = (candidate: string | null, fallback: string): string => {
  if (!candidate) return fallback;
  const trimmed = candidate.trim();
  
  if (HEX_COLOR_REGEX.test(trimmed)) {
    return trimmed.toUpperCase();
  }
  
  if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+\s*)?\)$/i.test(trimmed)) {
    return trimmed;
  }
  
  if (/^linear-gradient\([^)]+\)$/i.test(trimmed)) {
    return trimmed;
  }
  
  return fallback;
};

export const hexToRgba = (hex: string, opacity: number): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return hex;
};

export const getColorWithOpacity = (color: string, opacity: number): string => {
  if (/^linear-gradient\([^)]+\)$/i.test(color)) {
    return color;
  }
  
  const rgbaMatch = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/i);
  if (rgbaMatch) {
    return `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${opacity})`;
  }
  
  if (HEX_COLOR_REGEX.test(color)) {
    return hexToRgba(color, opacity);
  }
  
  return color;
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

