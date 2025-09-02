describe('Profile Creation Edge Cases', () => {
    const selectGender = (gender: string) => {
        cy.get('input[placeholder="Select gender"]').focus();
        cy.get(`.absolute.z-10 button`).contains(gender).click();
    };

    const next = () => cy.get('button').contains('Next').click();

    beforeEach(() => cy.visit('/create-profile'));

    it('Gender dropdown: toggle, click outside, keyboard, maintain selection', () => {
        cy.get('input[placeholder="Select gender"]').focus();
        cy.get('.absolute.z-10').should('be.visible');
        cy.get('body').click(); cy.get('.absolute.z-10').should('not.exist');
        cy.get('input[placeholder="Select gender"]').focus();
        cy.get('button[type="button"]').click(); cy.get('.absolute.z-10').should('be.visible');
        cy.get('button[type="button"]').click(); cy.get('.absolute.z-10').should('not.exist');
        cy.get('input[placeholder="Select gender"]').focus().type('{downArrow}{enter}');
        cy.get('input').should('have.value', 'Male');
        cy.get('input[placeholder="Select gender"]').focus();
        cy.get('.absolute.z-10 button').contains('Female').click();
        cy.get('input').should('have.value', 'Female');
    });

    it('Age input edge cases', () => {
        selectGender('Male'); next();
        const ageInput = cy.get('input[type="number"]');
        ['abc', '-5', '999', '25.5', '0'].forEach(val => { ageInput.clear().type(val).should('have.value', val); });
        ageInput.clear(); cy.get('button').contains('Next').should('be.disabled');
    });

    it('Form navigation & rapid click/back/refresh', () => {
        selectGender('Male'); next(); cy.get('input[type="number"]').type('25'); next();
        cy.get('button').contains('Next').click().click();
        cy.go('back'); cy.get('h2').should('contain.text', 'Your basic details');
        cy.reload(); cy.get('h2').should('contain.text', 'Who are you interested in?');
    });

    it('Text input validation', () => {
        selectGender('Male'); next(); cy.get('input[type="number"]').type('25'); next();
        const txtInput = cy.get('input[type="text"]').first();
        ['a'.repeat(1000), 'John@Doe#123$%^&*()', 'John 😊 Doe 🎉'].forEach(val => txtInput.clear().type(val).should('have.value', val));
        txtInput.clear(); cy.get('button').contains('Next').should('be.disabled');
        txtInput.clear().type('   ').should('have.value', '   ');
    });

    it('File upload edge cases', () => {
        selectGender('Male'); next(); cy.get('input[type="number"]').type('25'); next();
        cy.get('input[type="text"]').first().type('John Doe'); cy.get('textarea').type('Bio'); next();
        cy.get('input[type="file"]').selectFile('cypress/fixtures/example.json', { force: true });
    });

    it('Network, performance & browser edge cases', () => {
        cy.intercept('GET', '**/*', { delay: 2000 }); cy.visit('/create-profile');
        cy.intercept('GET', '**/*', { statusCode: 500 }); cy.visit('/create-profile');
        const viewports = [{ w: 320, h: 568 }, { w: 375, h: 667 }, { w: 414, h: 896 }, { w: 768, h: 1024 }, { w: 1024, h: 768 }, { w: 1920, h: 1080 }];
        viewports.forEach(v => { cy.viewport(v.w, v.h); cy.get('h1').should('be.visible'); });
    });

    it('Accessibility & keyboard navigation', () => {
        cy.get('body').type('{tab}'); cy.focused().should('have.attr', 'placeholder', 'Select gender');
        cy.focused().type('{enter}'); cy.get('.absolute.z-10').should('be.visible');
    });

    it('Data persistence & context state', () => {
        selectGender('Male'); next(); cy.get('input[type="number"]').type('25'); next();
        cy.get('input[type="text"]').first().type('John Doe');
        selectGender('Female'); next(); cy.get('input[type="number"]').type('28'); next();
        cy.get('input[type="text"]').first().type('Jane Smith');
    });
});
