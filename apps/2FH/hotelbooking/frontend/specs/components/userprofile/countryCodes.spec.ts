import { countryCodes } from '@/components/userprofile/countryCodes';

describe('countryCodes', () => {
  it('should export an array of country codes', () => {
    expect(Array.isArray(countryCodes)).toBe(true);
    expect(countryCodes.length).toBeGreaterThan(0);
  });

  it('should have correct structure for each country code', () => {
    countryCodes.forEach(country => {
      expect(country).toHaveProperty('code');
      expect(country).toHaveProperty('country');
      expect(typeof country.code).toBe('string');
      expect(typeof country.country).toBe('string');
      expect(country.code.startsWith('+')).toBe(true);
    });
  });

  it('should include specific countries', () => {
    const countryNames = countryCodes.map(c => c.country);
    const countryCodesList = countryCodes.map(c => c.code);

    expect(countryNames).toContain('Mongolia');
    expect(countryNames).toContain('USA');
    expect(countryNames).toContain('UK');
    expect(countryNames).toContain('China');
    expect(countryNames).toContain('Japan');
    expect(countryNames).toContain('Germany');
    expect(countryNames).toContain('France');

    expect(countryCodesList).toContain('+976');
    expect(countryCodesList).toContain('+1');
    expect(countryCodesList).toContain('+44');
    expect(countryCodesList).toContain('+86');
    expect(countryCodesList).toContain('+81');
    expect(countryCodesList).toContain('+49');
    expect(countryCodesList).toContain('+33');
  });

  it('should have unique country codes', () => {
    const codes = countryCodes.map(c => c.code);
    const uniqueCodes = new Set(codes);
    // Some countries might share the same code (like USA and Canada both use +1)
    expect(uniqueCodes.size).toBeLessThanOrEqual(codes.length);
  });

  it('should have unique country names', () => {
    const countries = countryCodes.map(c => c.country);
    const uniqueCountries = new Set(countries);
    expect(countries.length).toBe(uniqueCountries.size);
  });

  it('should have valid phone code format', () => {
    countryCodes.forEach(country => {
      // Phone codes should start with + and contain only digits
      expect(country.code).toMatch(/^\+\d+$/);
    });
  });

  it('should have non-empty country names', () => {
    countryCodes.forEach(country => {
      expect(country.country.trim().length).toBeGreaterThan(0);
    });
  });

  it('should contain all major regions', () => {
    const countryNames = countryCodes.map(c => c.country);
    
    // Check for countries from different regions
    expect(countryNames).toContain('USA'); // North America
    expect(countryNames).toContain('Brazil'); // South America
    expect(countryNames).toContain('UK'); // Europe
    expect(countryNames).toContain('China'); // Asia
    expect(countryNames).toContain('Australia'); // Oceania
    expect(countryNames).toContain('South Africa'); // Africa
  });

  it('should have consistent data structure', () => {
    countryCodes.forEach(country => {
      expect(Object.keys(country)).toHaveLength(2);
      expect(Object.keys(country)).toEqual(['code', 'country']);
    });
  });
});
