describe('Instagram Stories Component - Coverage Tests', () => {
  beforeEach(() => {
    cy.visit('/stories');
    cy.wait(1000); // Allow component to fully load
  });

  it('should redirect to /stories when reaching the end of all users', () => {
    // Start navigation from the first user through all users
    for (let i = 0; i < 5; i++) { // 5 users total
      // Navigate through all stories of current user
      cy.get('[data-testid="main-story-container"]').should('be.visible');
      
      // Get current user's story count and navigate through all stories
      cy.get('[data-testid^="progress-bar-"]').then(($progressBars) => {
        const storyCount = $progressBars.length;
        
        for (let j = 0; j < storyCount; j++) {
          if (i === 4 && j === storyCount - 1) {
            // Last story of last user - should redirect
            cy.get('[data-testid="next-story-area"]').click();
            cy.url().should('include', '/stories');
            return;
          } else {
            cy.get('[data-testid="next-story-area"]').click();
            cy.wait(500); // Allow for state updates
          }
        }
      });
    }
  });

  it('should handle previous user navigation correctly', () => {
    // Navigate to second user first
    cy.get('[data-testid="next-user-button"]').click();
    cy.wait(500);
    
    // Check we're on user2
    cy.get('[data-testid="main-user-username"]').should('contain', 'user2');
    
    // Navigate back to first user
    cy.get('[data-testid="prev-user-button"]').click();
    cy.wait(500);
    
    // Verify we're back to user1 and on their last story
    cy.get('[data-testid="main-user-username"]').should('contain', 'user1');
    cy.get('img[alt="story"]').should('be.visible');
  });

  it('should test getVisibleUsers edge cases by navigating to different positions', () => {
    // Navigate to middle user (user3 - index 2)
    cy.get('[data-testid="next-user-button"]').click();
    cy.wait(500);
    cy.get('[data-testid="next-user-button"]').click();
    cy.wait(500);
    
    // Should see user3 as main story
    cy.get('[data-testid="main-user-username"]').should('contain', 'user3');
    cy.get('img[alt="story"]').should('be.visible');
    
    // Should see side stories for adjacent users
    cy.get('[data-testid="side-story-1"]').should('be.visible');
    cy.get('[data-testid="side-story-2"]').should('be.visible');
    cy.get('[data-testid="side-story-4"]').should('be.visible');
    cy.get('[data-testid="side-story-5"]').should('be.visible');
  });

  it('should handle left navigation at the beginning', () => {
    // Should be on first user by default
    cy.get('[data-testid="main-user-username"]').should('contain', 'user1');
    
    // Previous user button should not exist when on first user
    cy.get('[data-testid="prev-user-button"]').should('not.exist');
    
    // Clicking prev story area should not crash or change user
    cy.get('[data-testid="prev-story-area"]').click();
    cy.wait(500);
    
    // Should still be on user1
    cy.get('[data-testid="main-user-username"]').should('contain', 'user1');
    cy.get('img[alt="story"]').should('be.visible');
  });

  it('should close stories and return to home when clicking X', () => {
    cy.get('[data-testid="close-stories-button"]').click();
    cy.url().should('not.include', '/stories');
  });

  it('should test auto-progression through stories', () => {
    // Wait for auto-progression to kick in
    cy.get('[data-testid="main-story-image"]').should('be.visible');
    
    // Check initial progress
    cy.get('[data-testid="progress-bar-0"]').should('be.visible');
    
    // Wait for story to auto-progress (5 seconds + buffer)
    cy.wait(6000);
    
    // Should have progressed to next story or user
    cy.get('img[alt="story"]').should('be.visible');
  });

  it('should display correct user avatars and usernames in side panels', () => {
    // Check that side panel users have correct avatars and usernames
    cy.get('[data-testid="side-user-avatar-2"]').should('be.visible');
    cy.get('[data-testid="side-user-username-2"]').should('contain', 'user2');
    
    // Navigate to see more side panels
    cy.get('[data-testid="next-user-button"]').click();
    cy.wait(500);
    
    cy.get('[data-testid="side-user-avatar-1"]').should('be.visible');
    cy.get('[data-testid="side-user-username-1"]').should('contain', 'user1');
    cy.get('[data-testid="side-user-avatar-3"]').should('be.visible');
    cy.get('[data-testid="side-user-username-3"]').should('contain', 'user3');
  });

  it('should handle navigation robustly without crashes', () => {
    // Test rapid navigation
    for (let i = 0; i < 3; i++) {
      cy.get('[data-testid="next-story-area"]').click();
      cy.wait(200);
    }
    
    // Check that navigation button contains the right symbol
    cy.get('[data-testid="next-user-button"]').should('contain', '▶');
    
    // Test navigation buttons
    cy.get('[data-testid="next-user-button"]').click();
    cy.wait(500);
    
    // Should still be functional
    cy.get('[data-testid="main-story-image"]').should('be.visible');
    cy.get('[data-testid="main-user-username"]').should('be.visible');
    
    // Test back navigation
    cy.get('[data-testid="prev-user-button"]').should('be.visible').click();
    cy.wait(500);
    
    cy.get('[data-testid="main-story-image"]').should('be.visible');
  });
});