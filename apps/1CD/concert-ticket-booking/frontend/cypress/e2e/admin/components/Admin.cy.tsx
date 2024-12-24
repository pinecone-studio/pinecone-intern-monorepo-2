describe('Admin component', () => {
    before(() => {
        cy.visit('/admin/home');
    });

    before(() => {
        cy.visit('/admin/home');
    });

    it('should render the copyright text', () => {
        cy.get('footer').contains('©2024 Copyright');
    });

    it('should have correct text color and opacity', () => {
        cy.get('footer').should('have.css', 'color', 'rgb(115, 115, 115)');
        cy.get('footer').should('have.css', 'opacity', '0.4');
    });

    it('should check path when clicking on navigation buttons', () => {
        cy.get('a').contains('Тасалбар').click();
        cy.get('a').contains('Цуцлах хүсэлт').click();
        cy.url().should('include', '/admin/cancel-request');
        cy.get('a').contains('Артист').click();
        cy.url().should('include', '/admin/');
        });

    it('should highlight active link when clicked', () => {
        cy.get('a').contains('Тасалбар').should('have.class', 'font-bold');
        cy.get('a').contains('Цуцлах хүсэлт').click();
        cy.get('a').contains('Цуцлах хүсэлт').should('have.class', 'font-bold');
        cy.get('a').contains('Тасалбар').should('not.have.class', 'font-bold');
        cy.get('a').contains('Артист').click();
        cy.get('a').contains('Артист').should('have.class', 'font-bold');
        cy.get('a').contains('Цуцлах хүсэлт').should('not.have.class', 'font-bold');
    });
});