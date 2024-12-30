describe('testing the swipe page', () => {
  beforeEach(() => {
    cy.visit('/recs');
    
  });
  it('1.should show the stack images ,swiping img and scroll the carousel', () => {
    cy.get('[data-cy="header"]').should('be.visible');
    cy.get('[data-cy="swipingImg"]').should('be.visible');
    cy.get('[data-cy="carousel"]').should('be.visible');
    cy.get('[data-cy="name On first Slide"]').should('be.visible');
    cy.get('[data-cy="age On first Slide"]').should('be.visible');
    cy.get('[data-cy="nextButton"]').should('be.visible').click();
    cy.get('[data-cy="secondName"]').should('be.visible');
    cy.contains('Interests').should('be.visible');
  });

  it('2.should swipe the card and get the img from the stack imgs', () => {
    cy.get('[data-cy="dislikeButton"]').should('be.visible').click();
    cy.wait(1000);
    cy.get('[data-cy="swipingImg"]').should('not.equal');
  });

  it('3.should swipe the card and get the img from the stack imgs', () => {
    cy.get('[data-cy="likeButton"]').should('be.visible').click();
    cy.wait(1000);
    cy.get('[data-cy="swipingImg"]').should('not.equal');
  });
  it('4.should swipe right the card', () => {
    cy.get('[data-cy="swipingImg"]').realMouseDown({position:'center'}).wait(1000).realMouseMove(200,200,{position:'right'}).wait(1000).realMouseUp({position:'right'})
    cy.wait(2000);
   
  });
  it('5.should swipe left the card', () => {
    cy.get('[data-cy="swipingImg"]').realMouseDown({position:'center'}).wait(1000).realMouseMove(-200,200,{position:'left'}).wait(1000).realMouseUp({position:'left'})
    cy.wait(2000);
  });
  it('6.should swipe up the card',()=>{
    cy.get('[data-cy="swipingImg"]').realSwipe('toTop');
    cy.wait(2000);
  });
  it('7.should try to swipe right the card but return to the default position', () => {
    cy.get('[data-cy="swipingImg"]').realSwipe('toLeft').wait(1000);
    cy.get('[data-cy="swipingImg"]').realMouseUp();
    cy.wait(2000);
  });
 

});
