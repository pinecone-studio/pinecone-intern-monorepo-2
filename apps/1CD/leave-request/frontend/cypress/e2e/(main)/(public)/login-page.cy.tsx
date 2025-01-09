describe('Login Component', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'CreatesOTP') {
        req.reply({
          data: {
            createsOTP: {
              email: req.body.variables.email,
              expirationDate: new Date().toISOString(),
            },
          },
        });
      }
    }).as('createOtp');
    cy.intercept('POST', '**/graphql', (req) => {
        if (req.body.operationName === 'CheckOTP') {
          req.reply({
            data: {
              checkOTP: 'valid token',
            },
          });
        }
      }).as('checkOtp');
  });

  it('should display validation error for invalid email', () => {
    cy.visit('/login'); // Adjust the route if the Login page is at a specific URL

    cy.get('[data-testid="email-input"]').type('invalid-email');
    cy.get('[data-testid="sendOTP-submit-button"]').click();

    cy.contains('И-мэйл хаяг буруу байна').should('be.visible');
  });

  it('should successfully send OTP and navigate to /sendOtp', () => {
    cy.visit('/login');

    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="sendOTP-submit-button"]').click();

    cy.wait('@createOtp');

    cy.url().should('include', '/sendOtp');
  });

  it('should display server error if mutation fails', () => {
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'CreatesOTP') {
        req.reply({
          errors: [{ message: 'Server error' }],
        });
      }
    }).as('createOtpError');

    cy.visit('/login');

    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="sendOTP-submit-button"]').click();

    cy.wait('@createOtpError');

    cy.contains('Server error').should('be.visible');
  });
  it('should check otp and will success to home page', () => {
    
    cy.visit('/login');

    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="sendOTP-submit-button"]').click();

    cy.wait('@createOtp');

    cy.url().should('include', '/sendOtp');

    cy.get('[data-testid="otp-input"]').type('1234');
  });
});
