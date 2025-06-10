describe('InterestSection', () => {
  beforeEach(() => {
    cy.visit('/profile');
  });

  it('should allow selecting and unselecting an interest', () => {
    cy.contains('Art').click().should('have.class', 'bg-rose-600');
    cy.contains('Art').click().should('not.have.class', 'bg-rose-600');
  });

  it('should allow selecting up to 10 interests only', () => {
    const interests = [
      'Art', 'Music', 'Investment', 'Technology', 'Design',
      'Education', 'Health', 'Fashion', 'Travel', 'Food'
    ];

    interests.forEach((interest) => {
      cy.contains(interest).click();
    });

    cy.contains('Art').click();
    cy.contains('Art').click();
    cy.contains('Art').click();

    cy.get('.bg-rose-600').should('have.length.lte', 10);
  });
});
