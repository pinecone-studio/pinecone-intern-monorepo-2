describe('Forgot-Password-Page', () => {
  beforeEach(() => {
    // Navigate to the forgot-password page before each test
    cy.visit('/forgot-password');
  });

  it('1. should render the forgot-password page', () => {
    cy.get('h1').contains('Нууц үг сэргээх'); // Checks that the heading is present
    cy.get('[data-cy="Forgot-Password-Page"]').should('be.visible'); // Checks that the page container is visible
  });

  it('2. should show validation errors for empty or invalid inputs', () => {
    // Attempt to submit the form without filling in the email input
    cy.get('[data-cy="Forgot-Password-Submit-Button"]').click();

    // Validate that the error message for the email field appears
    cy.get('.text-red-500').should('contain', 'Email must be at least 2 characters.');
  });

  it('3. should show a success message on valid form submission', () => {
    // Enter a valid email into the form
    cy.get('input[name="email"]').type('test@example.com');

    // Click the submit button
    cy.get('[data-cy="Forgot-Password-Submit-Button"]').click();

    // Assuming there is a success message shown when the email is successfully submitted
    cy.get('.sonner-toast').should('contain', 'Verification email sent successfully!');

    // Optionally, check if a toast component is rendered and dismisses correctly
    cy.wait(5000); // Wait to make sure the toast appears
  });

  it('4. should display an error message if the email is not found', () => {
    // Enter an invalid or non-existent email to trigger the error response
    cy.get('input[name="email"]').type('nonexistent@example.com');

    // Click the submit button
    cy.get('[data-cy="Forgot-Password-Submit-Button"]').click();

    // Check for an error message displayed as a toast or error state
    cy.get('.sonner-toast').should('contain', 'Email not found');
  });
});
