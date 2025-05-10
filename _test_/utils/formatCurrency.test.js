// This is a test for a hypothetical currency formatting utility
// Replace with actual utility import when available
// import { formatCurrency } from '../../utils/formatCurrency'

// Mock function for testing purposes
const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

describe('formatCurrency utility', () => {
  it('formats USD currency correctly', () => {
    expect(formatCurrency(10)).toBe('$10.00');
    expect(formatCurrency(10.5)).toBe('$10.50');
    expect(formatCurrency(1000)).toBe('$1,000.00');
  });

  it('formats EUR currency correctly', () => {
    expect(formatCurrency(10, 'EUR')).toBe('€10.00');
    expect(formatCurrency(10.5, 'EUR')).toBe('€10.50');
    expect(formatCurrency(1000, 'EUR')).toBe('€1,000.00');
  });

  it('formats currency with different locales correctly', () => {
    expect(formatCurrency(1000, 'USD', 'de-DE')).toMatch(/1\.000,00\s*\$/);
    expect(formatCurrency(1000, 'EUR', 'de-DE')).toMatch(/1\.000,00\s*€/);
  });

  it('handles zero correctly', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('handles negative values correctly', () => {
    expect(formatCurrency(-10)).toBe('-$10.00');
    expect(formatCurrency(-1000)).toBe('-$1,000.00');
  });
}); 