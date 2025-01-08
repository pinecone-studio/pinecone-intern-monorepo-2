describe('checkout page', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('[data-cy=Login-Email-Input]').type('badralbaigalmaa7@gmail.com');
    cy.get('[data-cy=Login-Password-Input]').type('badral1218');
    cy.get('[data-cy=Login-Submit-Button]').click();
    cy.url().should('not.include', '/login');
    cy.getAllLocalStorage();
    cy.visit('/checkout/6757dfb4687cb83ca69ff3cb');
  });
  it('1. Checkout-Home-Page is render', () => {
    cy.get('[data-cy=Checkout-Home-Page]').should('be.visible');
  });
  it('2. Checkout-Home-Page input not fill and click complete booking button', () => {
    cy.get('[data-cy=Complete-Booking-Button]').click();
    cy.get('[data-cy=FirstName-Error-Message').should('be.visible');
    cy.get('[data-cy=Email-Error-Message').should('be.visible');
    cy.get('[data-cy=Phonenumber-Error-Message').should('be.visible');
    cy.get('[data-cy=CardName-Error-Message').should('be.visible');

    cy.get('[data-cy=CardNumber-Error-Message').should('be.visible');

    cy.get('[data-cy=ExpirationDate-Error-Message').should('be.visible');
    cy.get('[data-cy=SecurityCode-Error-Message').should('be.visible');

    cy.get('[data-cy=Country-Error-Message').should('be.visible');
  });
  it('3. Checkout-Home-Page input fill and click complete booking button', () => {
    cy.get('[data-cy=FirstName-Input').type('test');
    cy.get('[data-cy=Email-Input').type('badralbaigalmaa7@gmail.com');
    cy.get('[data-cy=PhoneNumber-Input').type('80808080');
    cy.get('[data-cy=CardName-Input').type('badral');

    cy.get('[data-cy=CardNumber-Input').type('1234123412341234');

    cy.get('[data-cy=ExpiratoinDate-Input').type('1225');
    cy.get('[data-cy=Security-Code-Input').type('123');

    cy.get('[data-cy=Country-Select-Value').click();
    cy.get('[data-cy=Selected-country1]').click();
    cy.get('[data-cy=Complete-Booking-Button]').click();
    cy.contains('booking is succussfully').should('exist');
  });
});
