describe('Profile page', () => {
  beforeEach(() => {
    cy.visit('/profile');
  });
  it('1. should display the header', () => {
    cy.contains('Personal Information').should('be.visible');
    cy.contains('This is how others will see you on the site.').should('be.visible');
  });
  it('2. should display the name input field and accept user input', () => {
    cy.get('[data-cy="profile-name-input"]').type('test').should('have.value', 'test');
  });
  it('3. should display the email input field and accept user input', () => {
    cy.get('[data-cy="profile-email-input"]').type('test@gmail.com').should('have.value', 'test@gmail.com');
  });
  it('4. should allow entering December 1st, 2024, and submit the form', () => {
    cy.get('[data-cy="day-input"]').type('01');
    cy.get('[data-cy="month-input"]').type('12');
    cy.get('[data-cy="year-input"]').type('2000');
  });
  it('5. should select any gender and display it in the input', () => {
    cy.get('[data-cy="select-button"]').should('be.visible').click();
    cy.get('[data-cy="male-select-content"]').should('exist');
    cy.get('[data-cy="male-select-content-male"]').should('exist').click();
  });
  it('6. should display the bio input field and accept user input', () => {
    cy.get('[data-cy="profile-bio-input"]').type('test@gmail.com').should('have.value', 'test@gmail.com');
  });
  it('7. should select toggle item', () => {
    cy.get('[data-cy="toggle-item"]').should('be.visible').click();
  });
  it('8. should display the profession input field and accept user input', () => {
    cy.get('[data-cy="profile-profession-input"]').type('doctor').should('have.value', 'doctor');
  });
  it('9. should display the School/Work input field and accept user input', () => {
    cy.get('[data-cy="profile-school-input"]').type('school').should('have.value', 'school');
  });
  it('10. should display the School/Work input field and accept user input', () => {
    cy.get('[data-cy="next-button"]').should('be.visible').click();
    cy.url().should('include', '/recs');
  });
});
