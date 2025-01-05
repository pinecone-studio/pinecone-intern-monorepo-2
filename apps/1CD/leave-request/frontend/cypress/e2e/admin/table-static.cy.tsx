describe('TableStatic Component', () => {
  beforeEach(() => {
    const token = Cypress.env().env['ANNUAL_TOKEN_ADMIN'] as string
    cy.setCookie(
      'authtoken',
      token
    );
    cy.visit('/admin');
  });

  it('Хүснэгтийн толгой хэсгийг зөв харуулах', () => {
    cy.get('thead th').should('have.length', 9);
    cy.contains('th', 'Нэр, Овог').should('be.visible');
    cy.contains('th', 'Албан тушаал').should('be.visible');
    cy.contains('th', 'Имэйл').should('be.visible');
    cy.contains('th', 'Ажилд орсон огноо').should('be.visible');
    cy.contains('th', 'Зайнаас ажилласан өдөр').should('be.visible');
    cy.contains('th', 'Чөлөө авсан цаг').should('be.visible');
    cy.contains('th', 'Цалинтай чөлөө авсан өдөр').should('be.visible');
    cy.contains('th', 'Хүсэлт батлах ажилтан болгох').should('be.visible');
  });

  it('Ажилтны мэдээллийг зөв харуулах', () => {
    cy.get('tbody tr').should('exist');
    cy.get('tbody tr')
      .first()
      .within(() => {
        cy.get('td').first().should('contain', '1');
        cy.get('input[type="checkbox"]').should('exist');
      });
  });

  it('Уншиж байна текст харуулах', () => {
    cy.contains('Уншиж байна...').should('exist');
  });
});
