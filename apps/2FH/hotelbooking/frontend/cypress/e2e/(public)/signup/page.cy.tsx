describe('Sign up', () => {
  beforeEach(() => {
    cy.visit('/signup');
    cy.get('[data-cy=Sign-Up-Container]').should('be.visible');
    cy.get('[data-cy=Child-Container]').should('be.visible');
  });
  it('1. Has render sign up page', () => {
    cy.get('[data-cy=Logo-Container]').should('be.visible');
  });
  it('2. should successfully create user via email OTP flow', () => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'SendOtp') {
        req.reply({
          data: {
            sendOtp: { message: 'OTP sent' },
          },
        });
      }

      if (req.body.operationName === 'VerifyOtp') {
        req.reply({
          data: {
            verifyOtp: { message: 'Verified' },
          },
        });
      }

      if (req.body.operationName === 'CreateUser') {
        req.reply({
          data: {
            createUser: {
              email: 'test@example.com',
            },
          },
        });
      }
    }).as('graphqlMutations');

    // 2️⃣ Step 1: Enter Email
    cy.get('[data-cy=Enter-Email-Component-Container]').should('be.visible');
    cy.get('[data-cy="Enter-Email-Input"]').type('test@example.com');
    cy.get('[data-cy="Create-User-Email-Btn"]').click();

    // SendOtp mutation дууссан эсэхийг хүлээх
    cy.wait('@graphqlMutations');

    // 3️⃣ Step 2: OTP оруулах
    cy.get('[data-cy=Email-Validate-Container]').should('be.visible');
    cy.get('[data-cy=Otp-Inputs]').type('1234');

    // VerifyOtp mutation дууссан эсэхийг хүлээх
    cy.wait('@graphqlMutations');

    // Step 3: EnterPassword component
    cy.get('[data-cy=Enter-Password-Component]').should('be.visible');
    cy.get('[data-cy=Input-Password-Container]').should('be.visible');
    cy.get('[data-cy=Enter-Password-Input]').type('Password123');
    cy.get('[data-cy=Enter-Confirm-Password-Input]').type('Password123');

    // CreateUser mutation дууссан эсэхийг хүлээх
    cy.get('[data-cy=Create-User-Button]').click();
    cy.wait('@graphqlMutations');

    // Амжилттай үүссэн эсэхийг URL эсвэл toast message-аар шалгах
    cy.url().should('include', '/login');
  });
});
