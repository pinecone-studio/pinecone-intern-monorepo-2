describe('Sidebar Navigation', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid="open-sidebar"]').click();
  });

  const menuItems = [
    { label: 'Нүүр хуудас', testId: 'nav-home', path: '/' },
    { label: 'Хэтэвч', testId: 'nav-wallet', path: '/wallet' },
    { label: 'Хэрэглэгч', testId: 'nav-profile', path: '/profile' },
    { label: 'Захиалгын түүх', testId: 'nav-orders', path: '/orders' },
    { label: 'Бидний тухай', testId: 'nav-about', path: '/about' },
  ];

  menuItems.forEach(({ label, testId, path }) => {
    it(`"${label}" товч дарахад ${path} руу шилжих ёстой`, () => {
      cy.get(`[data-testid="${testId}"]`).click();
      cy.url().should('include', path);
    });
  });
});
