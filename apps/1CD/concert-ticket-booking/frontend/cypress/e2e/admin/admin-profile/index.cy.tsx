import { interceptGraphql } from "cypress/utils/intercept-graphql";

describe('AdminInfo Page', ()=>{
    beforeEach(()=>{
        const mockToken={
            token:'fakeToken',
        };
        cy.window().then((window)=>{
            window.localStorage.setItem('token', JSON.stringify(mockToken));
        });
        cy.visit('/admin/home/admin-profile');
    });
    it('should display user info and update', ()=>{
        interceptGraphql({
            state:'',
            operationName: 'GetMe',
            data:{
                data:{
                    getMe:{
                        email:'test@gmail.com',
                        role:'admin',
                        phoneNumber:'+97688888888',
                        __typename:'User',
                    },
                },
            },
        });
        cy.get('[data-cy="Info-Step-Button"]').click();
        cy.get('[data-cy="Admin-Info-Title"]').should('exist').and('contain.text', 'Хэрэглэгчийн мэдээлэл');
        cy.get('[data-cy="Input-phoneNumber"]').should('have.value', '+97688888888');
        cy.get('[data-cy="Input-email"]').should('have.value', 'test@gmail.com');
    });
    it('should have users information update', ()=>{
        interceptGraphql({
            state:'',
            operationName:'UpdateUser',
            data: {
                data: {
                    recoverPass: {
                        role:'admin',
                        __typename:'User',
                    },
                },
            },
        });
        cy.get('[data-cy="Info-Step-Button"]').click();
        cy.get('[data-cy="Admin-Info-Title"]').should('exist').and('contain.text', 'Хэрэглэгчийн мэдээлэл');
        cy.get('[data-cy="Input-phoneNumber"]').type('89898989');
        cy.get('[data-cy="Input-email"]').type('test12@gmail.com');
        cy.get('[data-cy="Admin-Info-Update-Button"]').click();
        cy.get('.toast').should('contain', 'User information succesfully updated');
    });
    it('should throw error if user not found', ()=>{
        interceptGraphql({
            state:'error',
            operationName:'UpdateUser',
            data:{
                    errors:[{
                        message:'User not found',
                    }],
                    data:null,
            },
        });
        cy.get('[data-cy="Info-Step-Button"]').click();
        cy.get('[data-cy="Input-phoneNumber"]').type('89898989');
        cy.get('[data-cy="Input-email"]').type('test12@gmail.com');
        cy.get('[data-cy="Admin-Info-Update-Button"]').click();
        cy.get('.toast').should('contain', 'User not found');
});
    it('should update admins email and role', ()=>{
        interceptGraphql({
            state:'',
            operationName:'UpdateUserRole',
            data:{
                data: {
                    updateUserRole:{
                        email:'admin@gmail.com',
                        role:'user',
                        __typename:'User',
                    },
                },
            },
        });
        cy.get('[data-cy="Admin-Role-Step-Button"]').click();
        cy.get('[data-cy="Admin-Role-Update-Title"]').should('exist').and('contain.text', 'Админ эрх үүсгэх');
        cy.get('[data-cy="Input-email"]').type('admin@gmail.com');
        cy.get('[data-cy="Input-role"]').type('admin');
        cy.get('[data-cy="Admin-Role-Submit-Button"]').click();
        cy.get('.toast').should('contain', 'User role succesfully updated');
    });
    it('should have throw error if user not found', ()=>{
        interceptGraphql({
            state:'error',
            operationName:'UpdateUserRole',
            data:{
                errors:[
                    {
                        message:'User not found',
                    },
                ],
                data:null,
            },
        });
        cy.get('[data-cy="Admin-Role-Step-Button"]').click();
        cy.get('[data-cy="Input-email"]').type('admin1@gmail.com');
        cy.get('[data-cy="Input-role"]').type('admin');
        cy.get('[data-cy="Admin-Role-Submit-Button"]').click();
        cy.get('.toast').should('contain', 'User not found');
    })
})