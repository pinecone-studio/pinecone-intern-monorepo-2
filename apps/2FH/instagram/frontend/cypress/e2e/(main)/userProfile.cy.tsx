describe("UserProfile Page", () => {
    beforeEach(() => {
     
      cy.visit("/userProfile");
    });
  
    it("should display username and profile buttons", () => {
      cy.contains("username").should("be.visible");
      cy.contains("Edit Profile").should("be.visible");
      cy.contains("Ad tools").should("be.visible");
    });
    
  
    it("should display posts/followers/following counts", () => {
      cy.contains("10 posts").should("be.visible");
      cy.contains("10 followers").should("be.visible");
      cy.contains("10 following").should("be.visible");
    });
  
    it("should display posts grid", () => {
      cy.contains("post").should("exist");
      cy.get(".grid > div").should("have.length.greaterThan", 2); // дор хаяж 3 post
    });
  
    it("should display bio and link", () => {
      cy.contains("Upvox").should("be.visible");
      cy.contains("Product/service").should("be.visible");
      cy.contains("upvox.net").should("have.attr", "href", "#");
    });
  });