/* eslint-disable no-secrets/no-secrets */

describe('notification', () => {
  const mockedNotification = [
    {
      _id: '1',
      createdDate: new Date('2025-01-01T05:23:39.132Z'),
      otherUserId: { userName: 'Erkashde2024', profileImg: 'https://res.cloudinary.com/dka8klbhn/image/upload/v1735788813/nguro3w6bkvs9zlad0d7.jpg' },
      notificationType: 'POSTLIKE',
    },
    {
      _id: '2',
      createdDate: new Date('2025-01-01T05:23:39.132Z'),
      otherUserId: { userName: 'Erkashde2024', profileImg: 'https://res.cloudinary.com/dka8klbhn/image/upload/v1735788813/nguro3w6bkvs9zlad0d7.jpg' },
      notificationType: 'FOLLOW',
    },
  ];
  it('1. Should load notifications postlike and follow req card', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzZiYmYzZTQwNTJiMTdhODA5YWFhNTUiLCJpYXQiOjE3MzU1MjQ0NjJ9.PVgtM4UPy8pR3U9fyhRhSHfzxlO2EHTmXm_UUmwFWYQ';
    const location = '/home';
    cy.loginWithFakeToken(location, token);

    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetNotificationsByLoggedUser') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              getNotificationsByLoggedUser: mockedNotification,
            },
          },
        });
      }
    });
    cy.visit('/home');
    cy.get('[data-cy="menuBtn3"]').click();
    // cy.get('[data-cy="notification-component"]').should('exist').and('be.visible');
    // cy.get('[data-cy="notifyDiv"]').should('exist').and('be.visible');
    cy.get('[data-cy="notify-postlike-card"]').should('be.visible');
    cy.get('[data-cy="notify-postlike-card"]')
      .eq(0)
      .within(() => {
        cy.get('[data-cy="notify-postlike-username"]').should('contain.text', 'Erkashde2024');
        cy.get('[data-cy="notify-postlike-proImg"]')
          .should('have.attr', 'src')
          .and('include', encodeURIComponent('https://res.cloudinary.com/dka8klbhn/image/upload/v1735788813/nguro3w6bkvs9zlad0d7.jpg'));
      });
    // cy.get('[data-cy="notify-followReqPub-card"]').should('exist').and('be.visible');
    cy.get('[data-cy="notify-followReqPub-card"]').within(() => {
      cy.get('[data-cy="notify-followReq-public-img"]')
        .should('have.attr', 'src')
        .and('include', encodeURIComponent('https://res.cloudinary.com/dka8klbhn/image/upload/v1735788813/nguro3w6bkvs9zlad0d7.jpg'));
    });
  });
  it('2. If notification data is empty should show no notification component', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzZiYmYzZTQwNTJiMTdhODA5YWFhNTUiLCJpYXQiOjE3MzU1MjQ0NjJ9.PVgtM4UPy8pR3U9fyhRhSHfzxlO2EHTmXm_UUmwFWYQ';
    const location = '/home';
    cy.loginWithFakeToken(location, token);

    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetNotificationsByLoggedUser') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              getNotificationsByLoggedUser: [],
            },
          },
        });
      }
    });
    cy.visit('/home');
    cy.get('[data-cy="menuBtn3"]').click();
    cy.get('[data-cy="notification-component"]').should('exist').and('be.visible');
    cy.get('[data-cy="noNotificationComp"]').should('exist').and('be.visible');
  });
});
