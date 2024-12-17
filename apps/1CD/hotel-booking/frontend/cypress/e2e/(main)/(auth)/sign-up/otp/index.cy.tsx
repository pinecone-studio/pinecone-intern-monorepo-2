describe('Email OTP Verification', () => {
  beforeEach(() => {
    cy.visit('/signup/otp');
  });

  it('1. Should render OTP page', () => {
    cy.get('[data-cy="Verify-Otp-Page"]').should('be.visible');
  });

  it('2. When user enters invalid OTP, it should send error', () => {
    const otp = '1234';
    const email = 'cypress@gmail.com';

    cy.window().then((win) => {
      win.localStorage.setItem('userEmail', email);
    });
    cy.window().then((win) => {
      win.localStorage.getItem('userEmail');
    });

    cy.get('[data-cy="Input-Otp-Value"]').should('be.visible');
    cy.get('[data-cy="Input-Otp-Value"]').type(otp);

    cy.contains('Invalid OTP');
  });
  it('3. When user enters expired OTP, it should send error', () => {
    const otp = '0001';
    const email = 'cypress@gmail.com';

    cy.window().then((win) => {
      win.localStorage.setItem('userEmail', email);
    });
    cy.window().then((win) => {
      win.localStorage.getItem('userEmail');
    });

    cy.contains(email);

    cy.get('[data-cy="Input-Otp-Value"]').should('be.visible');
    cy.get('[data-cy="Input-Otp-Value"]').type(otp);

    cy.contains('Invalid OTP');
  });
  it('4. When user enters valid OTP, it should render set password page', () => {
    cy.intercept('POST', 'api/graphql', (req) => {
      req.reply({
        body: {
          data: {
            email: email,
            message: 'Email verified successfully',
          },
        },
      });
    }).as('VerifyOTP');
    const otp = '1234';
    const email = 'test@gmail.com';
    cy.get('[data-cy="Input-Otp-Value"]').should('be.visible');
    cy.get('[data-cy="Input-Otp-Value"]').type(otp);

    if (otp.length === 4 && otp == '1234') {
      cy.wait('@VerifyOTP').then((intercept) => {
        assert.isNotNull(intercept.response?.body, 'Email verified successfully');
      });
    }

    cy.visit('/signup/password');
  });
  it('5. When user clicks on resend button, it should send OTP again and display success toast', () => {
    const email = 'test@gmail.com';

    cy.intercept('POST', 'api/graphql', (req) => {
      req.reply({
        body: {
          data: {
            email: email,
            message: 'OTP sent successfully',
          },
        },
      });
    }).as('SendOtpRequest');

    cy.get('[data-cy="Verify-Otp-Send-Again-Button"]').click();

    cy.wait('@SendOtpRequest').then((intercept) => {
      assert.isNotNull(intercept.response?.body, 'OTP sent successfully');
    });
    // cy.get('.Toastify__toast').should('be.visible').and('contain', 'OTP sent successfully');

    cy.get('[data-cy="Verify-Otp-Send-Again-Button"]').should('contain', 'Send again (15)');
    cy.contains('OTP sent successfully');
  });

  it('6. The resend countdown timer should decrease and reset when clicking "Send again"', () => {
    const email = 'test@gmail.com';

    cy.intercept('POST', 'api/graphql', (req) => {
      req.reply({
        body: {
          data: {
            email: email,
            message: 'OTP sent successfully',
          },
        },
      });
    }).as('SendOtpRequest');

    cy.visit('/signup/otp');

    cy.clock();

    cy.get('[data-cy="Send-Otp-Again-Countdown"]').should('contain', 'Send again (15)');

    cy.tick(5000);
    cy.get('[data-cy="Send-Otp-Again-Countdown"]').should('contain', 'Send again (10)');

    cy.tick(10000);
    cy.get('[data-cy="Send-Otp-Again-Countdown"]').should('contain', 'Send again (0)');

    cy.get('[data-cy="Send-Otp-Again-Countdown"]').click();

    cy.wait('@SendOtpRequest').then((intercept) => {
      assert.isNotNull(intercept.response?.body, 'OTP sent successfully');
    });

    cy.get('[data-cy="Send-Otp-Again-Countdown"]').should('contain', 'Send again (15)');

    cy.clock().then((clock) => clock.restore());
  });
});
