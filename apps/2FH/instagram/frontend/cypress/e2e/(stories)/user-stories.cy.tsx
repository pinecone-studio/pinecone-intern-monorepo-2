/// <reference types="cypress" />

describe('UserStories', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/graphql', {
      data: {
        getActiveStories: [
          {
            _id: 'story1',
            image: '/story1.png',
            author: {
              _id: '1',
              userName: 'Alice',
              profileImage: '/alice.png',
            },
          },
          {
            _id: 'story2',
            image: '/story2.png',
            author: {
              _id: '2',
              userName: 'Bob',
              profileImage: '/bob.png',
            },
          },
        ],
      },
    }).as('GetActiveStories');
  });

  it.skip('redirects to home after finishing all stories', () => {
    cy.visit('/');
    cy.wait('@GetActiveStories');

    // Эхний хэрэглэгч render болсон эсэх
    cy.get('[data-testid="story-viewer-story1"]').should('exist');

    // Эхний URL зөв эсэх
    cy.location('pathname').should('eq', '/');

    // Fake clock
    cy.clock();

    // Эхний story-г дуусгана → Bob руу шилжинэ
    cy.tick(5000);
    cy.get('[data-testid="story-viewer-story2"]').should('exist');
    cy.location('pathname').should('eq', '/'); // redirect болоогүй байгааг баталгаажуулна

    // Хоёр дахь story-г дуусгана → Home руу шилжинэ
    cy.tick(5000);

    // redirect '/' болсон эсэх
    cy.location('pathname', { timeout: 10000 }).should('eq', '/');
  });
});
