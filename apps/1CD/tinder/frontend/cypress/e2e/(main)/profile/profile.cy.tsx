describe('Profile page', () => {
  beforeEach(() => {
    cy.visit('/profile');

    cy.get('form').should('be.visible');
  });

  it('1. should display the header', () => {
    cy.contains('Personal Information').should('be.visible');
    cy.contains('This is how others will see you on the site.').should('be.visible');
  });

  it('2. should display the name input field and accept user input', () => {
    cy.get('[data-cy="profile-name-input"]').should('be.visible');
  });

  it('3. should display the email input field and accept user input', () => {
    cy.get('[data-cy="profile-email-input"]').should('be.visible');
  });

  it('4. should allow entering December 1st, 2000, and submit the form', () => {
    cy.get('[data-cy="day-input"]').should('be.visible').clear({ force: true }).type('01');
    cy.get('[data-cy="month-input"]').should('be.visible').clear({ force: true }).type('12');
    cy.get('[data-cy="year-input"]').should('be.visible').clear({ force: true }).type('2000');
  });

  it('5. should display the bio input field and accept user input', () => {
    cy.get('[data-cy="profile-bio-input"]').should('be.visible');
  });

  it('6. should select toggle item', () => {
    cy.get('[data-cy="toggle-item"]').first().should('be.visible').click();
  });

  it('7. should display the profession input field and accept user input', () => {
    cy.get('[data-cy="profile-profession-input"]').should('be.visible');
  });

  it('8. should display the School/Work input field and accept user input', () => {
    cy.get('[data-cy="profile-school-input"]').should('be.visible');
  });
});
