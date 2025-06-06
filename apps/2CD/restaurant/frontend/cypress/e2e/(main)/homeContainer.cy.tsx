
describe('HomeContainer', () => {
  beforeEach(() => {
    cy.visit('/Home');
  });

  const getPrice = (id: number) => cy.get(`[data-testid="price-${id}"]`);
  const getSaleButton = (id: number) => cy.get(`[data-testid="sale-button-${id}"]`);

  it('should render 4 taco items with visible images', () => {
    cy.get('[data-testid="taco-item"]').should('have.length', 4);

    cy.get('[data-testid="taco-item"]').each(($el) => {
      cy.wrap($el).find('img').should('be.visible');
    });
  });

  it('should display initial price correctly', () => {
    getPrice(1).should('contain', '15.6k');
  });

  it('should apply a 20% discount when sale button is clicked', () => {
    getSaleButton(1).click();
    getPrice(1).should('contain', '12.5k');
  });

  it('should apply multiple discounts correctly', () => {
    getSaleButton(1).click(); 
    getSaleButton(1).click(); 

    getPrice(1).should('contain', '10.0k');
  });

});
