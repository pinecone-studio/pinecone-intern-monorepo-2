/* eslint-disable no-secrets/no-secrets */
import { passwordComplexityCheck, passwordsMatch } from '../../../src/components/signup/Step2Form';

// Test to achieve 100% coverage by directly invoking exported helpers from Step2Form.tsx
describe('Step2Form - Final 100% Coverage Push (helpers)', () => {
  it('passwordComplexityCheck covers length and regex branches', () => {
    // Too short → true (bypasses regex)
    expect(passwordComplexityCheck('short')).toBe(true);
    // Long but invalid → false (executes regex branch)
    expect(passwordComplexityCheck('InvalidPass')).toBe(false); // Missing number
    expect(passwordComplexityCheck('invalidpwd1')).toBe(false); // Missing uppercase
    expect(passwordComplexityCheck('ALLUPPERCASE123')).toBe(false); // Missing lowercase
    expect(passwordComplexityCheck('NoNumbersHere')).toBe(false); // Missing numbers
    expect(passwordComplexityCheck('validpassword')).toBe(false); // Missing uppercase and numbers
    // Valid
    expect(passwordComplexityCheck('ValidPass123')).toBe(true);
  });

  it('passwordsMatch covers both outcomes', () => {
    expect(passwordsMatch({ password: 'ValidPass123', confirmPassword: 'ValidPass123' })).toBe(true);
    expect(passwordsMatch({ password: 'ValidPass123', confirmPassword: 'DifferentPass123' })).toBe(false);
  });
});
