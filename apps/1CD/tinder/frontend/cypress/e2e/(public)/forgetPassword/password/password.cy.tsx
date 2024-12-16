describe('creating the password', () => {
    beforeEach(() => {
      cy.clearAllLocalStorage();
      cy.visit('/forgetPassword/password');
    });
    it('1.should accept the password input and redirect to other page',()=>{
      cy.contains('tinder').should('be.visible');
      cy.contains('Set new password').should('be.visible');
      cy.contains('Use a minimum of 10 characters, including uppercase letters, lowercase letters, and numbers').should('be.visible');
      localStorage.setItem('userEmail','cypress@gmail.com');
      localStorage.getItem('userEmail');
      cy.get('[data-cy="register-password-input"]').should('be.visible').and('have.attr', 'placeholder','password1234@').type('Tinder1234@');
      cy.get('[data-cy="register-confirm-password-input"]').should('be.visible').and('have.attr','placeholder','password1234@').type('Tinder1234@');
      cy.contains('Continue').click();
      cy.url().should('include','/home');
  })
  it('2.should validate requirements of password input',()=>{
      const testCases=[
          {
              password:'Short',
              confirmPassword:'Short',
              expectedError:'Password must be longer than 10 charachters.'
          },
          {
              password:'TooLongpassssssssssssssssssss',
              confirmPassword:'TooLongpassssssssssssssssssss',
              expectedError:'Password must be shorter than 20 characters.'
          },
          {
              password:'password1234@',
              confirmPassword:'password1234@',
              expectedError:'Password must contain at least one uppercase letter.'
          },
          {
              password:'PASSWORD1234@',
              confirmPassword:'PASSWORD1234@',
              expectedError:'Password must contain at least one lowercase letter.'
          },
          {
              password:'Password@@@',
              confirmPassword:'Password@@@',
              expectedError:'Password must contain at least one number.'
          },
          {
              password:'Password1234',
              confirmPassword:'Password1234',
              expectedError:'Password must contain at least one special character.'
          },
          {
              password:'Password1213@',
              confirmPassword:'password1213@',
              expectedError:'Passwords must be identical.'
          }
      ];
      testCases.forEach(({password, confirmPassword,expectedError})=>{
          cy.get('[data-cy="register-password-input"]').clear().type(password);
          cy.get('[data-cy="register-confirm-password-input"]').clear().type(confirmPassword);
          cy.contains('Continue').click();
          cy.contains(expectedError).should('exist');
      })
  });
  it('3.should show error when email is empty',()=>{
      cy.get('[data-cy="register-password-input"]').type('Tinder1234@');
      cy.get('[data-cy="register-confirm-password-input"]').type('Tinder1234@');
      cy.contains('Continue').click();
      cy.contains('email and pass are required').should('exist');
  });
  it('4.should show when user is not found',()=>{
      localStorage.setItem('userEmail','cypress12345@gmail.com');
      localStorage.getItem('userEmail');
      cy.get('[data-cy="register-password-input"]').type('Tinder1234@');
      cy.get('[data-cy="register-confirm-password-input"]').type('Tinder1234@');
      cy.contains('Continue').click();
      cy.contains('user not found').should('exist');
  
  })
  });
  