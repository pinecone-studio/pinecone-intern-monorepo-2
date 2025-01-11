describe('profile Page ', () => {
  beforeEach(() => {
    cy.visit('/profile');
  });

  it('should render Profile Header when user is logged in', () => {
    cy.intercept('GET', '/api/graphql', {
      statusCode: 200,
      body: {
        user: {
          firstName: 'Nomt',
          email: 'cypress@gmail.com',
        },
      },
    }).as('getAuth');
    cy.get('[data-cy="Update-Profile-Header"]').should('exist');
  });
  it('should render Update Profile tabs button and inputs', () => {
    cy.get('[data-cy="Update-Profile-Input-And-Tabs"]').should('exist');
  });

  it('should switch tabs when clicked', () => {
    cy.get('[data-cy="Update-Profile-Click-Tab-Personal-Info"]').click();
    cy.get('[data-cy="Update-Profile-Personal-Info-Tab"]').should('be.visible');

    cy.get('[data-cy="Update-Profile-Click-Tab-Contact-Info"]').click();
    cy.get('[data-cy="Update-Profile-Contact-Info-Tab"]').should('be.visible');

    cy.get('[data-cy="Update-Profile-Click-Tab-Security-Settings"]').click();
    cy.get('[data-cy="Update-Profile-Security-Settings-Tab"]').should('be.visible');
  });
});
