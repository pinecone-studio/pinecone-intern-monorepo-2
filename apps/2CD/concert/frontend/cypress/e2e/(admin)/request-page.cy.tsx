describe('Request Management Page', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'GetAllRequest') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              getAllRequests: [
                {
                  id: '683d6b87fc710b966158f9ac',
                  name: 'John Doe',
                  bank: 'Khan Bank',
                  bankAccount: '1234567890',
                  status: 'PENDING',
                  createdAt: '2024-01-15T10:30:00Z',
                  booking: {
                    totalAmount: 50000,
                    concert: {
                      title: 'Rock Concert 2024',
                    },
                  },
                },
              ],
            },
          },
        });
      }
    }).as('getAllRequests');
    cy.visit('/request');
  });
  it('should navigate to Цуцлах хүсэлт page when clicking request tab', () => {
    cy.get('[data-testid="reqPageBtn"]').click();
    cy.url().should('include', '/request');
    cy.contains('Цуцлах хүсэлт').should('be.visible');
  });
  it('should navigate to Тасалбар page when clicking ticket tab', () => {
    cy.visit('/request');
    cy.get('[data-testid="ticketPageBtn"]').click();

    cy.url().should('include', '/ticket');
    cy.contains('Тасалбар').should('be.visible');
  });

  it('should display request data correctly', () => {
    cy.wait('@getAllRequests');
    cy.get('table tbody tr')
      .first()
      .within(() => {
        cy.contains('Rock Concert 2024').should('be.visible');
        cy.contains('Khan Bank:1234567890').should('be.visible');
        cy.contains('John Doe').should('be.visible');
        cy.contains('683d6b87fc710b966158f9ac').should('be.visible');
        cy.contains('01/15').should('be.visible');
      });
  });
  it('should show update modal for pending requests', () => {
    cy.wait('@getAllRequests');
    cy.get('table tbody tr')
      .first()
      .within(() => {
        cy.get('[data-testid="reqStatus"]').should('not.contain', 'шилжүүлсэн');
      });
  });

  it('should handle update request successfully', () => {
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'UpdateRequest') {
        req.reply({
          data: {
            updateRequest: 'Амжилттай шинэчлэгдлээ',
          },
        });
      }
    }).as('updateRequest');
    cy.wait('@getAllRequests');
    cy.get('table tbody tr')
      .first()
      .within(() => {
        cy.get('[data-testid="reqStatus"]').click();
      });
    cy.get('[data-testid="updateReqStatusBtn"]').click();
    cy.wait('@updateRequest');

    cy.contains('Амжилттай шинэчлэгдлээ').should('be.visible');
  });
  it('should show шилжүүлсэн if request status DONE', () => {
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'GetAllRequest') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              getAllRequests: [
                {
                  id: '683d6b87fc710b966158f9ac',
                  name: 'John Doe',
                  bank: 'Khan Bank',
                  bankAccount: '1234567890',
                  status: 'DONE',
                  createdAt: '2024-01-15T10:30:00Z',
                  booking: {
                    totalAmount: 50000,
                    concert: {
                      title: 'Rock Concert 2024',
                    },
                  },
                },
              ],
            },
          },
        });
      }
    }).as('getAllRequestsDone');

    cy.wait('@getAllRequestsDone');
    cy.get('table tbody tr').within(() => {
      cy.get('[data-testid="reqStatus"]').should('contain', 'шилжүүлсэн');
    });
  });

  it('should handle update request error', () => {
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'UpdateRequest') {
        req.reply({
          errors: [
            {
              message: 'Алдаа гарлаа',
              extensions: { code: 'INTERNAL_ERROR' },
            },
          ],
        });
      }
    }).as('updateRequestError');
    cy.wait('@getAllRequests');
    cy.get('table tbody tr')
      .first()
      .within(() => {
        cy.get('[data-testid="reqStatus"]').click();
      });
    cy.get('[data-testid="updateReqStatusBtn"]').click();
    cy.wait('@updateRequestError');
    cy.contains('Алдаа гарлаа').should('be.visible');
  });

  it('should display empty state when no requests', () => {
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'GetAllRequest') {
        req.reply({
          data: {
            getAllRequests: [],
          },
        });
      }
    }).as('emptyRequests');
    cy.visit('/request');
    cy.wait('@emptyRequests');
    cy.contains('Хүсэлт байхгүй байна').should('be.visible');
  });
});
