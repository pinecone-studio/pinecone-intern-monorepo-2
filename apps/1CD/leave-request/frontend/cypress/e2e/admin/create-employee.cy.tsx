describe('Create Employee', () => {
  beforeEach(() => {
    cy.visit('/admin');
  });

  it('should open the create employee modal', () => {
    cy.get('button').contains('Шинэ ажилтан бүртгэх').click();
    cy.contains('Дараах формыг бөглөж шинэ ажилтны мэдээллийг оруулна уу.').should('be.visible');
  });

  it('should close the modal when clicking the close button', () => {
    cy.get('button').contains('Шинэ ажилтан бүртгэх').click();
    cy.get('button').find('.w-4.h-4').click();
    cy.contains('Дараах формыг бөглөж шинэ ажилтны мэдээллийг оруулна уу.').should('not.exist');
  });

  it('should create a new employee with valid data', () => {
    cy.get('button').contains('Шинэ ажилтан бүртгэх').click();

    cy.get('input[name="userName"]').type('Test User');
    cy.get('input[name="position"]').type('Software Engineer');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="hireDate"]').type('2024-01-01');

    cy.get('[role="combobox"]').click();
    cy.get('[role="option"]').contains('Ажилтан').click();
    cy.get('button[type="submit"]').contains('Нэмэх').click();

    cy.contains('Ажилтан амжилттай бүртгэгдлээ').should('be.visible');
  });

  it('should show validation errors for required fields', () => {
    cy.get('button').contains('Шинэ ажилтан бүртгэх').click();

    cy.get('button[type="submit"]').contains('Нэмэх').click();

    cy.get('input[name="userName"]').should('have.attr', 'required');
    cy.get('input[name="position"]').should('have.attr', 'required');
    cy.get('input[name="email"]').should('have.attr', 'required');
    cy.get('input[name="hireDate"]').should('have.attr', 'required');
  });

  it('should validate email format', () => {
    cy.get('button').contains('Шинэ ажилтан бүртгэх').click();

    cy.get('input[name="email"]').type('invalid-email');
    cy.get('button[type="submit"]').contains('Нэмэх').click();
    cy.get('input[name="email"]').should('have.attr', 'invalid');
  });

  it('should handle server errors gracefully', () => {
    cy.intercept('POST', '/graphql', {
      statusCode: 500,
      body: {
        errors: [{ message: 'Server error occurred' }],
      },
    }).as('createUserError');

    cy.get('button').contains('Шинэ ажилтан бүртгэх').click();

    cy.get('input[name="userName"]').type('Test User');
    cy.get('input[name="position"]').type('Software Engineer');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="hireDate"]').type('2024-01-01');

    cy.get('[role="combobox"]').click();
    cy.get('[role="option"]').contains('Ажилтан').click();

    cy.get('button[type="submit"]').contains('Нэмэх').click();

    cy.contains('Server error occurred').should('be.visible');
  });
});
