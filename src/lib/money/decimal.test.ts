import { describe, expect, it } from 'vitest';
import { roundMoney, toMoney } from './decimal';

describe('money decimal helpers', () => {
  it('adds decimal values without binary floating-point drift', () => {
    expect(toMoney('0.10').plus('0.20').toFixed(2)).toBe('0.30');
  });

  it('rounds using the configured half-up policy', () => {
    expect(roundMoney('12.345').toFixed(2)).toBe('12.35');
  });
});
