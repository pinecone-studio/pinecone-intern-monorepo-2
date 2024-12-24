describe('Match Page', () => {
  beforeEach(() => {
    cy.visit('/match');
  });

  it('should display the header with logo and profile picture', () => {
    cy.get('[data-cy="logo-container"]').should('be.visible');
    cy.get('img[alt="Tinder logo"]').should('be.visible');
    cy.get('[data-cy="profile-picture"]').should('have.attr', 'src').and('include', '/my-profile.jpg');
  });

  it('should display a profile with image, name, and bio', () => {
    cy.get('[data-cy="profile-card"]').should('be.visible');
    cy.get('[data-cy="profile-image"]').should('have.attr', 'src').and('include', '/profile-image.jpg');
    cy.get('[data-cy="profile-name"]').should('contain', 'Mark, 40');
    cy.get('[data-cy="profile-bio"]').should('contain', 'Software Engineer Facebook');
  });

  it('should show the Match modal when the like button is clicked', () => {
    cy.get('[data-cy="like-button"]').click();
    cy.get('[data-cy="modal-header"]').should('contain', "It's a Match!");
    cy.get('[data-cy="match-images"] img').should('have.length', 2);
    cy.get('[data-cy="modal-footer"]').should('be.visible');
    cy.get('[data-cy="message-input"]').should('have.attr', 'placeholder', 'Say something nice');
    cy.get('[data-cy="send-button"]').should('contain', 'Send');
  });

  it('should close the modal when clicking outside the dialog', () => {
    cy.get('[data-cy="like-button"]').click();
    cy.get('[data-cy="modal-header"]').should('contain', "It's a Match!");
    cy.get('[data-cy="match-images"] img').should('have.length', 2);
    cy.get('[data-cy="modal-footer"]').should('be.visible');
    cy.get('[data-cy="message-input"]').should('have.attr', 'placeholder', 'Say something nice');
    cy.get('[data-cy="send-button"]').should('contain', 'Send');
    cy.get('[data-cy="match-page"]').click('bottomLeft', { force: true });
    cy.get('[data-cy="match-modal"]').should('not.exist');
  });
});
