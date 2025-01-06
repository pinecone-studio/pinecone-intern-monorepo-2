describe('Admin Page', () => {
  beforeEach(() => {
    cy.visit('/admin/home');
  });
  const mockToken = { token: 'faketoken' };
  const user = {
    email: 'example@gmail.com',
    role: 'user',
    phoneNumber: '+976 95160812',
    __typename: 'User',
  };

  beforeEach(() => {
    cy.window().then((window) => {
      window.localStorage.setItem('token', JSON.stringify(mockToken));
    });
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === 'GetMe') {
        req.reply({ data: { user } });
      }
    })
    cy.visit('/admin/home');
  });

  it('should display the user info with the email from the mock GraphQL response', () => {
    cy.get('[data-cy="AdminHeader-MenuBar-Button"]').click();
  
    cy.get('[data-cy="AdminHeader-Menubar-Email"]')
      .should('be.visible')
      .and('have.text', 'example@gmail.com'); 
  });

  // it('should render the copyright text', () => {
  //   cy.get('[data-cy="Admin-Footer"]').should('be.visible');
  //   cy.get('[data-cy="Admin-Footer"]').should('contain.text', '©2024 Copyright');
  // });

  // it('should render cancel request page', () => {
  //   cy.visit('/admin/cancel-request');
  //   cy.get('[data-cy="Cancel-Request-Text"]').should('be.visible');
  //   cy.get('[data-cy="Cancel-Request-Text"]').should('contain.text', 'Hello Cancel request page');
  // });

  // it('should render header', () => {
  //   cy.get('[data-cy="AdminHeader-Logo-Text"]').should('contain.text', 'TICKET BOOKING');
  //   cy.get('[data-cy="AdminHeader-MenuBar-Button"]').click();
  //   cy.get('[data-cy="AdminHeader-MenuBar-Button"]').should('be.visible');
  //   cy.get('[data-cy="AdminHeader-MenuBar-Content-Button-One"]').should('contain.text', 'Profile');
  //   cy.get('[data-cy="AdminHeader-MenuBar-Content-Button-One"]').click();
  //   cy.get('[data-cy="AdminHeader-MenuBar-Button"]').click();
  //   cy.get('[data-cy="AdminHeader-MenuBar-Button"]').should('be.visible');
  //   cy.get('[data-cy="AdminHeader-MenuBar-Content-Button-Two"]').should('contain.text', 'Exit');
  //   cy.get('[data-cy="AdminHeader-MenuBar-Content-Button-Two"]').click();
  // });
});
