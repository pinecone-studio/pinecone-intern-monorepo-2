import { formatNumber } from '../../../src/components/userProfile/format-number';

describe('formatNumber Utility', () => {
  it('should return the number as string when less than 1000', () => {
    expect(formatNumber(50)).toBe('50');
    expect(formatNumber(123)).toBe('123');
    expect(formatNumber(999)).toBe('999');
  });

  it('should format numbers >= 1000 with K suffix', () => {
    expect(formatNumber(1000)).toBe('1.0K');
    expect(formatNumber(1250)).toBe('1.3K');
    expect(formatNumber(2340)).toBe('2.3K');
    expect(formatNumber(3120)).toBe('3.1K');
  });

  it('should handle large numbers correctly', () => {
    expect(formatNumber(10000)).toBe('10.0K');
    expect(formatNumber(15750)).toBe('15.8K');
    expect(formatNumber(99999)).toBe('100.0K');
  });

  it('should handle edge cases', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(1)).toBe('1');
  });

  it('should round to one decimal place', () => {
    expect(formatNumber(1234)).toBe('1.2K');
    expect(formatNumber(1567)).toBe('1.6K');
    expect(formatNumber(1999)).toBe('2.0K');
  });
});
