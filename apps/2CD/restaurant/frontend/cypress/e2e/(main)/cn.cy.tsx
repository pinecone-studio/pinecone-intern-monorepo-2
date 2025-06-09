import { cn, getAuthCallBackUrl } from '../../../src/app/admin/_utils/cn';

describe('Utility Functions', () => {
  it('merges class names with cn', () => {
    const result = cn('text-red-500', 'font-bold', false && 'hidden', undefined, 'text-red-500');
    expect(result).to.equal('text-red-500 font-bold');
  });

  it('returns origin from getAuthCallBackUrl', () => {
    cy.window().then((win) => {
      // Make sure the function returns current origin
      expect(getAuthCallBackUrl()).to.equal(win.location.origin);
    });
  });

  it('returns undefined in non-window environment (simulated)', () => {
    // We can't fully simulate this in Cypress easily,
    // but we can mock it in unit tests instead.
    // Leaving this as a placeholder or can move to Jest test.
  });
});
