describe('UserStory Component', () => {
  const mockUserId = 'test-user-123';
  const mockStories = [
    { id: '1', title: 'Story 1', content: 'First story', author: mockUserId },
    { id: '2', title: 'Story 2', content: 'Second story', author: mockUserId },
    { id: '3', title: 'Story 3', content: 'Third story', author: mockUserId },
  ];

  beforeEach(() => {
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === 'GetStoryByUserId') {
        req.reply({ data: { getStoryByUserId: mockStories } });
      }
    }).as('getStoryByUserId');
    cy.window().then((win) => {
      (win as any).next = { router: { push: cy.stub().as('routerPush') } };
    });
  });
  it('displays loading state initially', () => {
    cy.intercept('POST', '/graphql', (req) => {
      req.reply({
        delay: 1000,
        body: { data: { getStoryByUserId: mockStories } },
      });
    });
    cy.visit(`/user-story/${mockUserId}`);
    cy.contains('Loading...').should('be.visible');
  });
  it('displays error when query fails', () => {
    cy.intercept('POST', '/graphql', {
      errors: [{ message: 'Network error' }],
    });
    cy.visit(`/user-story/${mockUserId}`);
    cy.contains('Error: Network error').should('be.visible');
  });
  it('displays no stories message when empty', () => {
    cy.intercept('POST', '/graphql', {
      data: { getStoryByUserId: [] },
    });
    cy.visit(`/user-story/${mockUserId}`);
    cy.contains('No stories found').should('be.visible');
  });
  it('renders story viewer with correct layout', () => {
    cy.visit(`/user-story/${mockUserId}`);
    cy.wait('@getStoryByUserId');
    cy.get('.w-full.h-screen.bg-\\[\\#18181b\\]').should('exist');
    cy.get('.max-w-\\[521px\\].aspect-\\[9\\/16\\]').should('exist');
    cy.get('[data-cy="story-header"]').should('exist');
    cy.get('[data-cy="story-progress"]').should('exist');
    cy.get('[data-cy="story-content"]').should('exist');
    cy.get('[data-cy="story-nav"]').should('exist');
  });
  it('displays correct progress bars', () => {
    cy.visit(`/user-story/${mockUserId}`);
    cy.wait('@getStoryByUserId');
    cy.get('[data-cy="progress-bar"]').should('have.length', 3);
    cy.get('[data-cy="progress-bar"]').first().should('have.class', 'active');
  });
  it('navigates to next story', () => {
    cy.visit(`/user-story/${mockUserId}`);
    cy.wait('@getStoryByUserId');
    cy.get('[data-cy="story-content"]').should('contain', 'First story');
    cy.get('[data-cy="next-btn"]').click();
    cy.get('[data-cy="story-content"]').should('contain', 'Second story');
  });
  it('navigates to previous story', () => {
    cy.visit(`/user-story/${mockUserId}`);
    cy.wait('@getStoryByUserId');
    cy.get('[data-cy="next-btn"]').click();
    cy.get('[data-cy="prev-btn"]').click();
    cy.get('[data-cy="story-content"]').should('contain', 'First story');
  });
  it('disables prev button on first story', () => {
    cy.visit(`/user-story/${mockUserId}`);
    cy.wait('@getStoryByUserId');
    cy.get('[data-cy="prev-btn"]').should('be.disabled');
  });
  it('redirects after last story', () => {
    cy.visit(`/user-story/${mockUserId}`);
    cy.wait('@getStoryByUserId');
    cy.get('[data-cy="next-btn"]').click();
    cy.get('[data-cy="next-btn"]').click();
    cy.get('[data-cy="next-btn"]').click();
    cy.get('@routerPush').should('have.been.calledWith', '/userProfile');
  });
  it('closes and redirects to profile', () => {
    cy.visit(`/user-story/${mockUserId}`);
    cy.wait('@getStoryByUserId');
    cy.get('[data-cy="close-btn"]').click();
    cy.get('@routerPush').should('have.been.calledWith', '/userProfile');
  });
  it('supports keyboard navigation', () => {
    cy.visit(`/user-story/${mockUserId}`);
    cy.wait('@getStoryByUserId');
    cy.get('body').type('{rightarrow}');
    cy.get('[data-cy="story-content"]').should('contain', 'Second story');
    cy.get('body').type('{leftarrow}');
    cy.get('[data-cy="story-content"]').should('contain', 'First story');
    cy.get('body').type('{esc}');
    cy.get('@routerPush').should('have.been.calledWith', '/userProfile');
  });
  it('handles tap navigation', () => {
    cy.visit(`/user-story/${mockUserId}`);
    cy.wait('@getStoryByUserId');
    cy.get('[data-cy="story-content"]').click('right');
    cy.get('[data-cy="story-content"]').should('contain', 'Second story');
    cy.get('[data-cy="story-content"]').click('left');
    cy.get('[data-cy="story-content"]').should('contain', 'First story');
  });
  it('auto-advances stories', () => {
    cy.visit(`/user-story/${mockUserId}`);
    cy.wait('@getStoryByUserId');
    cy.wait(5000);
    cy.get('[data-cy="story-content"]').should('contain', 'Second story');
  });
  it('pauses on hover', () => {
    cy.visit(`/user-story/${mockUserId}`);
    cy.wait('@getStoryByUserId');
    cy.get('[data-cy="story-content"]').trigger('mouseenter');
    cy.wait(6000);
    cy.get('[data-cy="story-content"]').should('contain', 'First story');
    cy.get('[data-cy="story-content"]').trigger('mouseleave');
    cy.wait(5000);
    cy.get('[data-cy="story-content"]').should('contain', 'Second story');
  });
  it('handles mobile swipes', () => {
    cy.viewport('iphone-x');
    cy.visit(`/user-story/${mockUserId}`);
    cy.wait('@getStoryByUserId');
    cy.get('[data-cy="story-content"]')
      .trigger('touchstart', { touches: [{ clientX: 300, clientY: 200 }] })
      .trigger('touchmove', { touches: [{ clientX: 100, clientY: 200 }] })
      .trigger('touchend');
    cy.get('[data-cy="story-content"]').should('contain', 'Second story');
  });
  it('maintains story state during navigation', () => {
    cy.visit(`/user-story/${mockUserId}`);
    cy.wait('@getStoryByUserId');
    cy.get('[data-cy="next-btn"]').click();
    cy.get('[data-cy="next-btn"]').click();
    cy.get('[data-cy="prev-btn"]').click();
    cy.get('[data-cy="next-btn"]').click();
    cy.get('[data-cy="story-content"]').should('contain', 'Third story');
    cy.get('[data-cy="progress-bar"]').eq(2).should('have.class', 'active');
  });
});
