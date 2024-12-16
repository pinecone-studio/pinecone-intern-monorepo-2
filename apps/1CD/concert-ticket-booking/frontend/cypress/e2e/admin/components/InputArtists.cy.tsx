/// <reference types="cypress" />

describe('InputArtists Component', () => {
  beforeEach(() => {
    cy.visit('/admin/home');
  });

  it('should add and remove main artist inputs', () => {
    cy.get('[data-testid="create-event-button"]').click();

    cy.get('[data-testid="add-main-artist-button"]').click();
    cy.get('[data-testid="main-artist-name-input-1"]').should('exist');
    cy.get('[data-testid="remove-main-artist-button-1"]').click();
    cy.get('[data-testid="main-artist-name-input-1"]').should('not.exist');
  });
  it('should not have empty input fields after removal', () => {
    cy.get('[data-testid="create-event-button"]').click();
    cy.get('[data-testid="remove-main-artist-button-0"]').click();
    cy.get('[data-testid="main-artist-name-input-0"]').should('not.exist');
  });
  it('should display proper artist names when added', () => {
    cy.get('[data-testid="create-event-button"]').click();
    cy.get('[data-testid="main-artist-name-input-0"]').type('Main Artist 1');
    cy.get('[data-testid="guest-artist-name-input-0"]').type('Guest Artist 1');

    // Check that the input values are populated correctly
    cy.get('[data-testid="main-artist-name-input-0"]').should('have.value', 'Main Artist 1');
    cy.get('[data-testid="guest-artist-name-input-0"]').should('have.value', 'Guest Artist 1');
  });
  it('should not have empty input fields for guest artists after removal', () => {
    cy.get('[data-testid="create-event-button"]').click();
    cy.get('[data-testid="guest-artist-name-input-0"]').should('exist');
    cy.get('[data-testid="add-guest-artist-button"]').click();
    cy.get('[data-testid="guest-artist-name-input-1"]').should('exist');

    // Click the remove button for this artist
    cy.get('[data-testid="remove-guest-artist-button-1"]').click();

    cy.get('[data-testid="guest-artist-name-input-1"]').should('not.exist');
  });
  it('should not have empty input fields for guest artists after removal', () => {
    cy.get('[data-testid="create-event-button"]').click();

    // Click the remove button for this artist
    cy.get('[data-testid="remove-guest-artist-button-0"]').click();

    // Ensure the guest artist input field is removed
    cy.get('[data-testid="guest-artist-name-input-0"]').should('not.exist');
  });
});
