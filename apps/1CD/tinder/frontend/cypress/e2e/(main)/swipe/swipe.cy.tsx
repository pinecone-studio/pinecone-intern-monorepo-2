describe('testing the swipe page',()=>{
    beforeEach(()=>{
        cy.visit('/swipe');
    });
    it('1.should show the stack images ,swiping img and scroll the carousel',()=>{
        cy.get('[data-cy="stackImgs"]').should('be.visible');
        cy.get('[data-cy="swipingImg"]').should('be.visible');
        cy.get('[data-cy="carousel"]').should('be.visible');
        cy.get('[data-cy="name On first Slide"]').should('be.visible');
        cy.get('[data-cy="age On first Slide"]').should('be.visible');
        cy.get('[data-cy="nextButton"]').should('be.visible').click();
        cy.get('[data-cy="secondName"]').should('be.visible');
        cy.contains('Interests').should('be.visible');
    });
    it('2.should swipe the card and get the img from the stack imgs',()=>{
        cy.get('[data-cy="dislikeButton"]').should('be.visible').click();
        cy.get('[data-cy="swipingImg"]').should('not.equal');
    });
    it('3.should swipe right the card',()=>{
        cy.get('[data-cy="swipingImg"]').trigger('mousemove',200,50);
        cy.get('[data-cy="swipingImg"]').should('not.equal');
    });
    it('4.should swipe left the card',()=>{
        cy.get('[data-cy="swipingImg"]').trigger('mousemove', { clientX: -200, clientY:50 });
        cy.get('[data-cy="swipingImg"]').should('not.equal');
    });


   
});
