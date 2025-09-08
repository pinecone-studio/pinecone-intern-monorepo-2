// Images Section E2E Tests

describe('Images Section', () => {
  beforeEach(() => {
    cy.visit('/images');
  });

  it('renders the images grid and header', () => {
    cy.contains('h2', 'Your Images').should('be.visible');
    cy.get('[title="Delete image"]').should('have.length.greaterThan', 0);
  });

  it('deletes an image and reduces the count', () => {
    cy.get('[title="Delete image"]').then(($buttons) => {
      const initialCount = $buttons.length;
      cy.wrap($buttons.first()).click();
      cy.get('[title="Delete image"]').should('have.length', initialCount - 1);
    });
  });

  it('saves images and shows success notification', () => {
    cy.contains('button', 'Save Images').click();
    cy.contains('Images saved successfully').should('be.visible');
  });
}); 