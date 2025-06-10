describe('Profile Page', () => {
  beforeEach(() => {
    cy.visit('/profile');
  });

  it('should render header and user info', () => {
    cy.contains('Hi, Shagai').should('exist');
    cy.contains('n.shagai@pinecone.mn').should('exist');
  });

  it('should default to Profile tab', () => {
    cy.get('button.bg-zinc-800').should('contain.text', 'Profile');
    cy.get('form').should('exist');
  });

  it('should switch to Images tab and show UploadImage UI', () => {
    cy.contains('Images').click();
    cy.get('button.bg-zinc-800').should('contain.text', 'Images');

    cy.contains('Your Images').should('exist');
    cy.contains('Please choose an image that represents you.').should('exist');

    cy.get('.bg-red-300').should('have.length', 6);

    cy.contains('button', 'Upload image').should('exist');
  });

  it('should switch back to Profile tab', () => {
    cy.contains('Images').click();
    cy.contains('Profile').click();
    cy.get('form').should('exist');
  });
});
