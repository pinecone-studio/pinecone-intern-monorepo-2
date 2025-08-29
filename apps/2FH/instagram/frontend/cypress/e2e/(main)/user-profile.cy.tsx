// apps/frontend-e2e/src/e2e/user-profile.cy.ts

describe("User Profile Page", () => {
  beforeEach(() => {
    // Тест эхлэх бүрт user profile руу орох
    cy.visit("/userProfile");
  });

  it("should display username and profile info", () => {
    cy.contains("travel.explorer").should("be.visible");
    cy.contains("Alex Chen").should("be.visible");
    cy.contains("Content Creator").should("be.visible");
    cy.contains("📸 Travel Photographer").should("be.visible");
  });

  it("should show profile picture", () => {
    cy.get("img[alt='travel.explorer profile picture']").should("be.visible");
  });

  it("should display stats (posts, followers, following)", () => {
    cy.contains("284 posts").should("be.visible");
    cy.contains("15.6K followers").should("be.visible");
    cy.contains("432 following").should("be.visible");
  });

  it("should have Edit Profile and Ad tools buttons", () => {
    cy.contains("Edit Profile").should("be.visible");
    cy.contains("Ad tools").should("be.visible");
  });

  it("should have website link clickable", () => {
    cy.get("a")
      .contains("alexchen-photography.com")
      .should("have.attr", "href")
      .and("include", "https://alexchen-photography.com");
  });

  it("should display POSTS and SAVED tabs", () => {
    // Verify both tabs are visible
    cy.get("button").contains("POSTS").should("be.visible");
    cy.get("button").contains("SAVED").should("be.visible");
    
    // Verify POSTS tab is active (has font-semibold class)
    cy.get("button").contains("POSTS").should("have.class", "font-semibold");
    
    // Verify SAVED tab is not active initially
    cy.get("button").contains("SAVED").should("not.have.class", "font-semibold");
    
    // Verify tabs are clickable (they should not be disabled)
    cy.get("button").contains("POSTS").should("not.be.disabled");
    cy.get("button").contains("SAVED").should("not.be.disabled");
  });
});