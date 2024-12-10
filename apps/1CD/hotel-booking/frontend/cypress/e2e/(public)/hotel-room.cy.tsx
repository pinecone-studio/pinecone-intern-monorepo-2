describe('Home-Hotel-Detail', ()=>{
    it('Should render hotel-room', ()=>{
        cy.visit('/');
        cy.get('[data-cy="HomeHotellDetail"]').should('be.visible');
        cy.get('[data-cy="FreeWifi"]').should('contain', 'Free Wifi');
    });
});