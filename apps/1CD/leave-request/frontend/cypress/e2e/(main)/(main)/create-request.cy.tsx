describe('Create Request', () => {
  beforeEach(() => {
    cy.setCookie(
      'authtoken',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzRlZDc5NGYzN2YzYjJmZmJiMGE5ZDYiLCJ1c2VybmFtZSI6InpvbGphcmdhbCB0c2VuZGRvcmoiLCJyb2xlIjoic3VwZXJ2aXNvciIsInBvc2l0aW9uIjoiRW5naW5lZXIiLCJlbWFpbCI6InpvbG9va29yem9sb29AZ21haWwuY29tIiwiaWF0IjoxNzM0NDEwNTIxLCJleHAiOjE3NjU5NjgxMjF9.e-PNWUte475ttOUpiInbjdntQ-5mCIlG6mAkF8dB9Dk'
    );
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
    cy.contains('button', 'Select Option...').click()
    cy.contains('div', 'zoljargal tsenddorj').click()
    cy.get('textarea').type('FML')

    cy.contains('button', 'Хүсэлт илгээх').click()
  });
});
