describe('User-Details Page', ()=>{
    beforeEach(()=>{
        cy.visit('/register/details')
    })
    
    it('1.Should render userdetails page', ()=>{
        cy.get('[data-cy="User-Details-Page"]').should('be.visible')
    })

    it('2. When user enter only name, next button should be disabled', ()=>{
        cy.get('[data-cy="User-Details-Name-Input"]').type('Anna')
        cy.get('[data-cy="User-Details-Next-Button"]').should('be.disabled')
    })
    it('3. When user enters username and length is <2 characters, then enter bio it should display error message',()=>{
        cy.get('[data-cy="User-Details-Name-Input"]').type('A')
        cy.get('[data-cy="User-Details-Bio-Input"]').type('freelancer')
        cy.get('[data-cy="User-Details-Next-Button"]').should('be.disabled')
        cy.get('[data-cy="User-Details-Name-Input-Error-Message"]').should('be.visible')
        cy.get('[data-cy="User-Details-Name-Input-Error-Message"]').should('have.text','Name length must be at least 2 characters')
    })

    it('4. When user only enter bio, next button should be disabled', ()=>{
        cy.get('[data-cy="User-Details-Bio-Input"]').type('freelancer')
        cy.get('[data-cy="User-Details-Next-Button"]').should('be.disabled')
    })
    it('5. When user does not enter profession, it should display error message', ()=>{
        cy.get('[data-cy="User-Details-Name-Input"]').type('Anna')
        cy.get('[data-cy="User-Details-Bio-Input"]').type('freelancer')
        cy.get('[data-cy="User-Details-Next-Button"]').should('be.disabled')
    })

    it('6. When user enters name, profession, bio and click on next button, next button should be enabled', ()=>{
        cy.get('[data-cy="User-Details-Name-Input"]').type('Anna')
        cy.get('[data-cy="User-Details-Bio-Input"]').type('freelancer')
        cy.get('[data-cy="User-Details-Profession-Input"]').type('Software developer')
        cy.get('[data-cy="User-Details-Next-Button"]').should('not.be.disabled')
    })
    
    it('7. When user enters all required values with valid email and click on next button, it should navigate to image page', ()=>{
        cy.get('[data-cy="User-Details-Name-Input"]').type('Anna')
        cy.get('[data-cy="User-Details-Bio-Input"]').type('freelancer')
        cy.get('[data-cy="User-Details-Profession-Input"]').type('Software developer')
        cy.get('[data-cy="User-Details-Next-Button"]').click()
        cy.get('[data-cy="User-Details-Name-Input"]').should('not.have.value')
        cy.get('[data-cy="User-Details-Bio-Input"]').should('not.have.value')
        cy.get('[data-cy="User-Details-Interests-Input"]').should('not.have.value')
        cy.get('[data-cy="User-Details-Profession-Input"]').should('not.have.value')
        cy.get('[data-cy="User-Details-schoolWork-Input"]').should('not.have.value')
        cy.contains('Successfully added your information')
        cy.url().should('include','/register/photos')
    })
    it('8. When click on back button it should navigate to birthday page', ()=>{
        cy.visit('/register/details')
        cy.get('[data-cy="User-Details-Back-Button"]').click()
        cy.url().should('include','/register/birthday')
    })
})