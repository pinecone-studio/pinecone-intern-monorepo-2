describe('Create Request', () => {
  beforeEach(() => {
    const token = Cypress.env().env['ANNUAL_TOKEN_SUPERVISEE'] as string;
    cy.setCookie('authtoken', token);
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'CreateRequest') {
        req.reply({
          data: {
            getAllSupervisors: [{ email: 'zolookorzoloo@gmail.com', userName: 'zoljargal tsenddorj' }],
          },
        });
      }
    }).as('createsRequest');
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'CreateRequest') {
        req.reply({
          data: {
            checkAvailavleRemoteLeaveInGivenMonth: {
              nextMonth: 5,
              thisMonth: 5,
            },
            checkAvailablePaidLeaveInGivenYear: {
              nextYear: 40,
              thisYear: 4,
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
    cy.get('[aria-label="Go to next month"]').click();
    cy.contains('button', '30').last().click();
    cy.contains('div', 'Чөлөө авах өдөр').click();
    cy.contains('button', '00:00').first().click();
    cy.contains('div', '8:00').click();
    cy.contains('button', '00:00').click();
    cy.wait(500);
    cy.contains('div', '15:00').last().click();
  });
});
