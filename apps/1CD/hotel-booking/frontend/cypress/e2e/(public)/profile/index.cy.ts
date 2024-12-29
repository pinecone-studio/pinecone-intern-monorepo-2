describe('profile Page ', () => {
  beforeEach(() => {
    cy.visit('/profile');
  });

  it('should render Profile Header', () => {
    cy.get('[data-cy="Update-Profile-Header]').should('be.visible');
  });
  it('should render Update Profile tabs button and inputs', () => {
    cy.get('[data-cy="Update-Profile-Input-And-Tabs"]').should('exist');
  });
  it('should should render specific page when clicked ', () => {
    cy.get('[data-cy="Home-Page-Button]').click();
    cy.visit('/');

    cy.get('[data-cy="Signup-Page-Button]').click();
    cy.visit('/signup');

    cy.get('[data-cy="Login-Page-Button]').click();
    cy.visit('/login');
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
