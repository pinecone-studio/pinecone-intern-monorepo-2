describe('notification', () => {
  const mockedNotification = [{ _id: '1' }];
  it('1. Should load notification', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzZiYmYzZTQwNTJiMTdhODA5YWFhNTUiLCJpYXQiOjE3MzU1MjQ0NjJ9.PVgtM4UPy8pR3U9fyhRhSHfzxlO2EHTmXm_UUmwFWYQ';
    const location = '/home/mery';
    cy.loginWithFakeToken(location, token);

    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetNotificationsByLoggedUser') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              getNotificationsByLoggedUser: [
                {
                  _id: 'postNumber1',
                  images: ['https://example.com/image1.jpg'],
                },
              ],
            },
          },
        });
      }
    });
    cy.visit('/home/mery');
  });
});
