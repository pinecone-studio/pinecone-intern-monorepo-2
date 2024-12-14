describe('InputGenreWithLocation Component', () => {
  beforeEach(() => {
    // Visit the page or open the modal
    cy.visit('/admin/home'); // Adjust the URL to match your app's routing

    // Intercept the GraphQL request to fetch arenas and categories
    cy.intercept('POST', '/api/graphql').as('graphqlRequest');

    // Open the modal by clicking the create event button
    cy.get('[data-testid="create-event-button"]').click();

    // Wait for the GraphQL request to complete
    cy.wait('@graphqlRequest');

    // Ensure the modal and the venue select container are visible
    cy.get('[data-testid="venue-select-container"]').should('be.visible');
    cy.get('[data-testid="category-select-container"]').should('be.visible');
    cy.get('[data-testid="venue-select"]').should('be.visible');
    cy.get('[data-testid="category-button"]').should('be.visible');
  });

  it('should open the venue select dropdown and select an option', () => {
    // Ensure the venue select element exists and is visible
    cy.get('[data-testid="venue-select"]').should('be.visible');

    // Click on the venue select to open the dropdown
    cy.get('[data-testid="venue-select"]').click();

    // Ensure the dropdown items are visible
    cy.get('[data-testid="arena-item-0"]').should('be.visible');
    cy.get('[data-testid="arena-item-1"]').should('be.visible');

    // Select the first item
    cy.get('[data-testid="arena-item-1"]').click();

    // Optionally, assert the selected value has been updated
    cy.get('[data-testid="venue-select"]').should('contain.text', 'UG-arena');
  });

  it('should open the category select dropdown and select an option', () => {
    // Ensure the category button is visible
    cy.get('[data-testid="category-button"]').should('be.visible');

    // Click on the category button to open the dropdown
    cy.get('[data-testid="category-button"]').click();

    // Ensure the category items are visible
    cy.get('[data-testid="category-item-0"]').should('be.visible');

    // Select the first category item (adjust according to your data)
    cy.get('[data-testid="category-item-0"]').click();

    // Assert that the selected category is updated in the button text
    cy.get('[data-testid="category-button"]').should('contain.text', 'Rock'); // Adjust based on your data

    // Ensure that selecting a category updates the field value
    cy.get('[data-testid="category-button"]')
      .should('have.text', 'Rock') // Adjust as needed based on your categories
      .click(); // Close the popover

    // Ensure the selected category is still there
    cy.get('[data-testid="category-button"]').should('contain.text', 'Rock');
  });

  it('should toggle category selection on click', () => {
    // Open the category popover
    cy.get('[data-testid="category-button"]').click();

    // Select the first category item
    cy.get('[data-testid="category-item-0"]').click();

    // Ensure that the item was selected and check if the check icon is visible
    cy.get('[data-testid="category-item-0"]')
      .find('.opacity-100') // Ensures that the check icon is visible
      .should('exist');

    // Deselect the category
    cy.get('[data-testid="category-item-0"]').click();

    // Ensure that the check icon is hidden after deselection
    cy.get('[data-testid="category-item-0"]')
      .find('.opacity-0') // Ensures that the check icon is hidden
      .should('exist');
  });
});
