describe('Requests Component', () => {
  beforeEach(() => {
    cy.visit('/myRequest');
  });

  it('should render RequestCard components with correct data', () => {
    cy.get('.w-[214px]').should('have.length', 3);
    cy.get('.w-[214px]')
      .first()
      .within(() => {
        cy.get('.text-sm').first().should('contain.text', 'Зайнаас ажиллах');
        cy.get('.text-2xl').should('contain.text', '3 хоног');
        cy.get('.text-sm.text-[#71717A]').should('contain.text', 'боломжтой байна.');
        cy.get('.text-sm').contains('Зайнаас ажиллах');

        cy.get('svg').should('exist');
      });

    cy.get('.w-[214px]')
      .eq(1)
      .within(() => {
        cy.get('.text-sm').first().should('contain.text', 'Цалинтай чөлөө');
        cy.get('.text-2xl').should('contain.text', '4 хоног');
        cy.get('.text-sm.text-[#71717A]').should('contain.text', 'боломжтой байна.');
      });


    cy.get('.w-[214px]')
      .eq(2)
      .within(() => {
        cy.get('.text-sm').first().should('contain.text', 'Чөлөө');
        cy.get('.text-2xl').should('contain.text', '4 цагийн');
        cy.get('.text-sm.text-[#71717A]').should('contain.text', 'чөлөө авсан байна');
      });
  });

  it('should render correct icons', () => {
    // Test if the icon is present in the first two cards where it's included
    cy.get('.w-[214px]').eq(0).find('svg').should('exist'); // Icon exists in first card
    cy.get('.w-[214px]').eq(1).find('svg').should('exist'); // Icon exists in second card

    // The third card should NOT have an icon
    cy.get('.w-[214px]').eq(2).find('svg').should('not.exist');
  });

  it('should have the correct structure for each RequestCard', () => {
    // Check if each RequestCard has the correct structure
    cy.get('.w-[214px]').each(($card) => {
      cy.wrap($card).find('.text-sm').should('exist');
      cy.wrap($card).find('.text-2xl').should('exist');
      cy.wrap($card).find('.text-sm.text-[#71717A]').should('exist');
    });
  });
});
