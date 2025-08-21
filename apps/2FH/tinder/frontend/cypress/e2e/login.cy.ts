describe("Login Page", () => {
    it("should log in successfully", () => {
      cy.visit("/login");
      cy.get("input[placeholder='name@example.com']")
        .first()
        .type("test@mail.com");
  
      cy.get("input[type='password']").type("123456");
  
      cy.intercept("POST", "/api/graphql", {
        body: {
          data: {
            login: {
              status: "SUCCESS",
              message: "Login success",
              token: "fake-token-123",
              user: {
                id: "1",
                email: "test@mail.com",
              },
            },
          },
        },
      }).as("loginMutation");
 
      cy.contains("Continue").click();
  
      cy.wait("@loginMutation");
  
      cy.window().then((win) => {
        expect(win.localStorage.getItem("token")).to.eq("fake-token-123");
      });
  
      cy.on("window:alert", (text) => {
        expect(text).to.contains("Login successful!");
      });
    });
  
    it("should show error when login fails", () => {
      cy.visit("/login");
  
      cy.get("input[placeholder='name@example.com']").type("wrong@mail.com");
      cy.get("input[type='password']").type("wrongpass");
  
      cy.intercept("POST", "/api/graphql", {
        body: {
          data: {
            login: {
              status: "ERROR",
              message: "Invalid credentials",
              token: null,
              user: null,
            },
          },
        },
      }).as("loginFail");
  
      cy.contains("Continue").click();
  
      cy.wait("@loginFail");
  
      cy.on("window:alert", (text) => {
        expect(text).to.contains("Invalid credentials");
      });
    });
  });
  