describe ('Chat page should be visible', ()=>{
    beforeEach(()=>{
        cy.visit('/chat/chatstart')
    })
    it('1.It should render chat page', ()=>{
        cy.get('[data-cy="Chat-Matches-Page"]').should('be.visible')
        cy.get('[data-cy="Chat-Sidebar-Page"]').should('be.visible')
        cy.get('[data-cy="Chat-Part-Page"]').should('be.visible')
    })
    it('2.When type in message input and click on send input data that wrotten in input should be visible on chat part', ()=>{
        cy.get('[data-cy="Chat-Part-Message-Input"]').type('helllo')
        cy.get('[data-cy="Chat-Part-Send-Button"]').click()
        cy.get('[data-cy="Chat-Part-Page"]').contains('helllo')
        cy.get('[data-cy="Chat-Part-Message-Input"]').should('not.have.value')
    })
})