import Decimal from 'decimal.js';

Decimal.set({ precision: 24, rounding: Decimal.ROUND_HALF_UP });

export type MoneyInput = string | Decimal;

/**
 * Convert a decimal string or Decimal instance to Decimal.
 *
 * JavaScript numbers are deliberately rejected: a value such as 0.1 has
 * already been converted to binary floating point before this function runs.
 * Pass literal and API values as strings instead.
 */
export function toMoney(value: MoneyInput): Decimal {
  if (typeof value !== 'string' && !Decimal.isDecimal(value)) {
    throw new TypeError('Money values must be decimal strings or Decimal instances.');
  }

  return new Decimal(value);
}

export function roundMoney(value: MoneyInput, decimalPlaces = 2): Decimal {
  if (!Number.isInteger(decimalPlaces) || decimalPlaces < 0) {
    throw new RangeError('decimalPlaces must be a non-negative integer.');
  }

  return toMoney(value).toDecimalPlaces(decimalPlaces, Decimal.ROUND_HALF_UP);
}
