// apps/2FH/instagram/frontend/cypress/e2e/(main)/otherUser.cy.tsx

describe('Other User Page', () => {
  // Хэрэв setup хийх шаардлагагүй бол beforeEach устгасан
  // beforeEach(() => {});

  it('should display the other user profile correctly', () => {
    cy.visit('/other-user/someId');

    // Жишээ assertion – өөрийнхөө дагуу тааруулж болно
    cy.contains('Followers');
    cy.contains('Following');
  });
});
