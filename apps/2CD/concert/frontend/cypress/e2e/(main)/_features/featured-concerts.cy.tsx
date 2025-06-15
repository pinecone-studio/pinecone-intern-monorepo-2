describe('FeaturedConcerts', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'GetFeaturedConcert') {
        req.reply({
          body: {
            data: {
              getFeaturedConcerts: [
                {
                  title: 'Summer Beats 2025',
                  thumbnailUrl: 'https://url',
                  artists: [
                    {
                      name: 'Uka',
                    },
                    {
                      name: 'The Hu',
                    },
                  ],
                  schedule: [
                    {
                      startDate: '2025-07-15T18:00:00.000Z',
                    },
                  ],
                },
                {
                  title: 'Gobi Desert Vibes',
                  thumbnailUrl: 'https://url',
                  artists: [
                    {
                      name: 'Bold',
                    },
                  ],
                  schedule: [
                    {
                      startDate: '2025-08-05T20:00:00.000Z',
                    },
                  ],
                },
              ],
            },
          },
        });
      }
    }).as('getFeaturedConcerts');
  });
  it('should display featured concert data correctly', () => {
    cy.visit('/');
    cy.wait('@getFeaturedConcerts');
    cy.get('[data-testid="featured-concert0"]').contains('Summer Beats 2025').should('be.visible');
    cy.get('[data-testid="featured-concert0"]').contains('Uka').should('be.visible');
    cy.get('[data-testid="featured-concert0"]').contains('The Hu').should('be.visible');
  });
});
