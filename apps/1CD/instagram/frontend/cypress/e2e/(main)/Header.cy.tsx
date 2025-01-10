// describe('Header Component', () => {
//   beforeEach(() => {
//     cy.visit('/home');
//   });

//   it('1.should display the search component when Search button is clicked', () => {
//     cy.get('[data-testid="searchBtn"]').click();

//     cy.get('[data-testid="search-users-component"]').should('exist').and('be.visible');
//   });

//   it('2.should hide the search component when Notification button is clicked', () => {
//     // cy.get('[data-testid="searchBtn"]').click();

//     // cy.get('[data-testid="search-users-component"]').should('be.visible');

//     cy.get('[data-testid="menuBtn3"]').click();

//     cy.get('[data-testid="search-users-component"]').should('not.exist');
//   });

//   it('3. Should display the notification component when notification button is clicked', () => {
//     cy.get('[data-testid="menuBtn3"]').click();
//     cy.get('[data-testid="notification-component"]').should('exist');
//   });

//   it('4. Should hide the notification component when home button is clicked', () => {
//     // cy.get('[data-testid="notificationBtn"]').click();

//     // cy.get('[data-testid="notification-component"]').should('be.visible');
//     cy.get('[data-testid="menuBtn3"]').click();
//     cy.get('[data-testid="notification-component"]').should('exist');
//     cy.get('[data-testid="menuBtn3"]').click();

//     cy.get('[data-testid="notification-component"]').should('not.exist');
//   });

//   it('5.should open the Create Post modal when CreatePostBtn is clicked', () => {
//     cy.get('[data-testid="moreCreateBtn"]').click();
//     cy.get('[data-testid="CreatePostBtn"]').should('be.visible').click();

//     cy.wait(500);

//     // cy.get('[data-testid="UpdateImagesStep1"]', { timeout: 30000 }).should('exist').and('be.visible');
//   });

//   it('6.should hide the search component when Profile is clicked', () => {
//     cy.get('[data-testid="searchBtn"]').click();

//     cy.get('[data-testid="search-users-component"]').should('be.visible');

//     cy.get('[data-testid="menuBtn2"]').click();

//     cy.get('[data-testid="search-users-component"]').should('not.exist');
//   });
// });
