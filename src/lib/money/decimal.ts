import Decimal from 'decimal.js';

Decimal.set({ precision: 24, rounding: Decimal.ROUND_HALF_UP });

/**
 * Convert a supported money input to Decimal.
 * Never use JavaScript floating-point arithmetic for financial calculations.
 * Business-specific currency scale and rounding rules must be approved before production use.
 */
export function toMoney(value: string | number | Decimal): Decimal {
  return new Decimal(value);
}

export function roundMoney(value: string | number | Decimal, decimalPlaces = 2): Decimal {
  return toMoney(value).toDecimalPlaces(decimalPlaces, Decimal.ROUND_HALF_UP);
}
