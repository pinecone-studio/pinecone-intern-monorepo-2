describe('Header Component', () => {
  beforeEach(() => {
    cy.visit('/home');
  });

  it('1.should display the search component when Search button is clicked', () => {
    cy.get('[data-testid="searchBtn"]').click();

    cy.get('[data-testid="search-users-component"]', { timeout: 10000 }).should('exist').and('be.visible');
  });

  it('2.should hide the search component when Notification button is clicked', () => {
    cy.get('[data-testid="searchBtn"]').click();

    cy.get('[data-testid="search-users-component"]').should('be.visible');

    cy.get('[data-testid="menuBtn3"]').click();

    cy.get('[data-testid="search-users-component"]').should('not.exist');
  });

  it('3.should open the Create Post modal when CreatePostBtn is clicked', () => {
    cy.get('[data-testid="moreCreateBtn"]').click();
    cy.get('[data-testid="CreatePostBtn"]').should('be.visible').click();

    // Wait for modal to render
    cy.wait(500); // You can adjust this time if necessary

    cy.get('[data-testid="UpdateImagesStep1"]', { timeout: 30000 }).should('exist').and('be.visible');
  });

  it('4.should hide the search component when Profile is clicked', () => {
    cy.get('[data-testid="searchBtn"]').click();

    cy.get('[data-testid="search-users-component"]').should('be.visible');

    cy.get('[data-testid="menuBtn2"]').click();

    cy.get('[data-testid="search-users-component"]').should('not.exist');
  });
});
