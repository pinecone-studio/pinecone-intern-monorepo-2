
describe('testing the swipe page', () => {
  beforeEach(() => {
    cy.visit('/swipe');
    
  });
  it('1.should show the stack images ,swiping img and scroll the carousel', () => {
    cy.get('[data-cy="stackImgs"]').should('be.visible');
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

  it.only('3.should swipe right the card', () => {
    cy.get('[data-cy="swipingImg"]').click()
    // cy.get('[data-cy="swipingImg"]').realSwipe('toRight',{'touchPosition':'right'})
    cy.get('[data-cy="swipingImg"]')
    .realSwipe('toRight', {
      length: 150,     
    });
    cy.wait(5000);
    // cy.get('[data-cy="swipingImg"]').trigger('mousedown');
    
    // .trigger('mousemove', { which: 1, pageX: 300, pageY: 70 }).trigger('mouseup');
    // cy.wait(1000);
    // cy.get('[data-cy="swipingImg"]').should('not.equal');
  });
  // it('4.should swipe left the card', () => {
  //   cy.get('[data-cy="swipingImg"]').trigger('mousedown', 'center').trigger('mousemove', { clientX: -300, clientY: 50 }).trigger('mouseup');
  //   cy.wait(1000);
  //   cy.get('[data-cy="swipingImg"]').should('not.equal');
  // });
  // it('5.should swipe up the card', () => {
  //   cy.get('[data-cy="swipingImg"]').trigger('mousedown', 'center').trigger('mousemove', { clientX: 0, clientY: -80 }).trigger('mouseup');
  //   cy.wait(1000);
  //   cy.get('[data-cy="swipingImg"]').should('not.equal');
  // });
});
