describe('User-Details Page', ()=>{
    beforeEach(()=>{
        cy.visit('/userdetails')
    })
    
    it('1.Should render userdetails page', ()=>{
        cy.visit('/userdetails')
        cy.get('[data-cy="User-Details-Page"]').should('be.visible')
    })

    it('2. When user does not enter name, it should display error message', ()=>{
        cy.get('[data-cy="User-Details-Bio-Input"]').type('freelancer')
        cy.get('[data-cy="User-Details-Next-Button"]').click()
        cy.get('[data-cy="User-Details-Name-Input-Error-Message"]').should('be.visible')
        cy.get('[data-cy="User-Details-Name-Input-Error-Message"]').should('have.text','Name is required')
    })
    it('3. When user enters username and length is <2 characters, it should display error message',()=>{
        cy.get('[data-cy="User-Details-Name-Input"]').type('0')
        cy.get('[data-cy="User-Details-Next-Button"]').click()
        cy.get('[data-cy="User-Details-Name-Input-Error-Message"]').should('be.visible')
        cy.get('[data-cy="User-Details-Name-Input-Error-Message"]').should('have.text','Name length must be at least 2 characters')
    })
    it('4. When user does not enter bio, it should display error message', ()=>{
        cy.get('[data-cy="User-Details-Name-Input"]').type('Anna')
        cy.get('[data-cy="User-Details-Next-Button"]').click()
        cy.get('[data-cy="User-Details-Bio-Input-Error-Message"]').should('be.visible')
        cy.get('[data-cy="User-Details-Bio-Input-Error-Message"]').should('have.text','Bio is required')
    })
    it('5. When user does not enter profession, it should display error message', ()=>{
        cy.get('[data-cy="User-Details-Name-Input"]').type('Anna')
        cy.get('[data-cy="User-Details-Bio-Input"]').type('freelancer')
        cy.get('[data-cy="User-Details-Next-Button"]').click()
        cy.get('[data-cy="User-Details-Profession-Input-Error-Message"]').should('be.visible')
        cy.get('[data-cy="User-Details-Profession-Input-Error-Message"]').should('have.text','Profession is required')
    })
    // it('6. When user click on back button, it should navigate to user page', ()=>{
    //     cy.get('[data-cy="User-Details-Back-Button"]').click()
    //     cy.url().should('include','user')
    // })
    it('7. When user enters all required values with valid email and click on next button, it should navigate to photo page', ()=>{
        cy.get('[data-cy="User-Details-Name-Input"]').type('Anna')
        cy.get('[data-cy="User-Details-Bio-Input"]').type('freelancer')
        cy.get('[data-cy="User-Details-Profession-Input"]').type('Software developer')
        cy.get('[data-cy="User-Details-Next-Button"]').click()
        cy.get('[data-cy="User-Details-Name-Input"]').should('not.have.value')
        cy.get('[data-cy="User-Details-Bio-Input"]').should('not.have.value')
        cy.get('[data-cy="User-Details-Interests-Input"]').should('not.have.value')
        cy.get('[data-cy="User-Details-Profession-Input"]').should('not.have.value')
        cy.get('[data-cy="User-Details-schoolWork-Input"]').should('not.have.value')
        cy.contains('Your email is not valid')
        // cy.url().should('include','photo')
    })
    it('8. When user enters all required values with no valid email and click on next button, it should navigate to photo page', ()=>{
        const email= "sam@gmail.com"
        cy.window().then((window) => {
            window.localStorage.setItem('userEmail', JSON.stringify(email));
          });
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
        // cy.url().should('include','photo')
    })
})