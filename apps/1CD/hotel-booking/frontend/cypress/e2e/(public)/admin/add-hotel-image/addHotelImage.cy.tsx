describe('add hotel image', () => {
  it('1. should render', () => {
    cy.visit('/add-hotel/add-hotel-image');
    cy.get('[data-cy=Open-Dialog-Button]').click();
    cy.get('[data-cy=Dialog-Element]').should('be.visible');
    cy.get('[data-cy=Image-Upload-Input]').selectFile('cypress/fixtures/wallpaper.jpg', { force: true });
    cy.get('[data-cy=Save-Button]').click();
    cy.get('[data-cy=Dialog-Element]').should('not.exist');
    //   .then(() => {
    //     cy.waitUntil(() => cy.get('[data-cy=Dialog-Element]').should('not.exist'));
    //   });
  });
  it('2. should render', () => {
    cy.visit('/add-hotel/add-hotel-image');
    cy.get('[data-cy=Open-Dialog-Button]').click();
    cy.get('[data-cy=Dialog-Element]').should('be.visible');
    cy.get('[data-cy=Cancel-Button]').click();
  });
});
