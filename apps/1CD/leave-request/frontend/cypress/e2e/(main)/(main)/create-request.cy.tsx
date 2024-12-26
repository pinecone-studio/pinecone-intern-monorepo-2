describe('Create Request', () => {
  beforeEach(() => {
    const token = Cypress.env().env['ANNUAL_TOKEN'] as string;
    cy.setCookie('authtoken', token);
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'CreatesRequest') {
        req.reply({
          data: {
            createsReqest: {
              createsRequest: {
                email: 'zolookorzoloo@gmail.com',
              },
            },
          },
        });
      }
    }).as('createsRequest');
  });

  it('should render make new request', () => {
    cy.visit('createNewRequest');
  });
  it('should make one request', () => {
    cy.visit('createNewRequest');
    cy.get('#requestTypeInput').click();
    cy.get('#requestTypeOptions').children().first().click();
    cy.get('button[value="hourly"]').click();
    cy.contains('button', 'Та өдрөө').click();
    cy.contains('button', '30').click();
    cy.contains('div', 'Чөлөө авах өдөр').click();
    cy.contains('button', '00:00').first().click();
    cy.contains('div', '8:00').click();
    cy.contains('button', '00:00').click();
    cy.wait(500);
    cy.contains('div', '15:00').last().click();
    cy.contains('button', 'Select Option...').click();
    cy.get('textarea').type('FML');
    cy.contains('button', 'Хүсэлт илгээх').click();
  });
});
