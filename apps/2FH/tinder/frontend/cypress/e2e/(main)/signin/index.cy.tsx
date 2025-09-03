describe("Login Page", () => {
  beforeEach(() => {cy.visit("/signin");});
  it("should log in successfully", () => {
    cy.get("input[placeholder='name@example.com']").first().type("test@mail.com");
    cy.get("input[type='password']").first().type("123456");
    cy.intercept("POST", "/api/graphql", {
      body: {
        data: {
          login: {
            status: "SUCCESS",
            message: "Login successful!",
            token: "fake-token-123",
            user: { id: "1", email: "test@mail.com" },
          },
        },
      },
    }).as("loginMutation");
    cy.contains("Continue").click();
    cy.wait("@loginMutation");
    cy.get("[data-cy='login-success']").should("be.visible").and("contain.text", "Login successful!");
    cy.window().then((win) => {
      expect(win.localStorage.getItem("token")).to.eq("fake-token-123");
    });
  });
  it("should show error when login fails", () => {
    cy.get("input[placeholder='name@example.com']").first().type("wrong@mail.com");
    cy.get("input[type='password']").first().type("wrongpass");
    cy.intercept("POST", "/api/graphql", {
      body: {
        data: {
          login: {
            status: "ERROR",
            message: "Invalid credentials",
            token: null,
            user: null,},},},
    }).as("loginFail");
    cy.contains("Continue").click();
    cy.wait("@loginFail");
    cy.get("[data-cy='login-error']")
      .should("be.visible")
      .and("contain.text", "Invalid credentials");
  });
  it("should show Apollo error message", () => {
    cy.intercept("POST", "/api/graphql", {
      statusCode: 500,
      body: { errors: [{ message: "Internal server error" }] },
    }).as("loginError");

    cy.get("input[placeholder='name@example.com']").first().type("test@mail.com");
    cy.get("input[type='password']").first().type("123456");

    cy.contains("Continue").click();
    cy.wait("@loginError");

    cy.get("[data-cy='login-apollo-error']")
      .should("be.visible")
      .and("contain.text", "Something went wrong during login.");
  });
  it("should handle network error", () => {
    cy.get("input[placeholder='name@example.com']").first().type("test@mail.com");
    cy.get("input[type='password']").first().type("123456");
    cy.intercept("POST", "/api/graphql", { forceNetworkError: true }).as("networkError");
    cy.contains("Continue").click();
    cy.wait("@networkError");
    cy.get("[data-cy='login-apollo-error']")
      .should("be.visible")
      .and("contain.text", "Something went wrong during login.");
  });
  it("should show validation errors when fields are empty", () => {
    cy.contains("Continue").click();
    cy.contains("Email is required").should("be.visible");
    cy.contains("Password is required").should("be.visible");
  });
  it("should show 'Login failed' when error message is empty", () => {
    cy.get("input[placeholder='name@example.com']").first().type("empty@message.com");
    cy.get("input[type='password']").first().type("123456");
    cy.intercept("POST", "/api/graphql", {
      body: {
        data: {
          login: {
            status: "ERROR",
            message: null,
            token: null,
            user: null,
          },
        },
      },
    }).as("loginNoMessage");
    cy.contains("Continue").click();
    cy.wait("@loginNoMessage");
    cy.get("[data-cy='login-error']")
      .should("be.visible")
      .and("contain.text", "Login failed");
  });
  it("should handle successful login with empty message", () => {
    cy.get("input[placeholder='name@example.com']").first().type("test@mail.com");
    cy.get("input[type='password']").first().type("123456");
    cy.intercept("POST", "/api/graphql", {
      body: {
        data: {
          login: {
            status: "SUCCESS",
            message: "", // Empty message
            token: "fake-token-123",
            user: { id: "1", email: "test@mail.com" },
          },
        },
      },
    }).as("loginSuccessEmpty");
    cy.contains("Continue").click();
    cy.wait("@loginSuccessEmpty");
    cy.window().then((win) => {
      expect(win.localStorage.getItem("token")).to.eq("fake-token-123");
    });
  });
  it("should handle GraphQL error response", () => {
    cy.get("input[placeholder='name@example.com']").first().type("test@mail.com");
    cy.get("input[type='password']").first().type("123456");
    cy.intercept("POST", "/api/graphql", {
      statusCode: 400,
      body: {
        errors: [
          {
            message: "GraphQL validation error",
            extensions: { code: "BAD_REQUEST" }
          }
        ]
      },
    }).as("graphqlError");
    cy.contains("Continue").click();
    cy.wait("@graphqlError");
    cy.get("[data-cy='login-apollo-error']")
      .should("be.visible")
      .and("contain.text", "Something went wrong during login.");
  });
  it("should show loading state during login", () => {
    cy.get("input[placeholder='name@example.com']").first().type("test@mail.com");
    cy.get("input[type='password']").first().type("123456");
    cy.intercept("POST", "/api/graphql", {
      delay: 1000,
      body: {
        data: {
          login: {
            status: "SUCCESS",
            message: "Login successful!",
            token: "fake-token-123",
            user: { id: "1", email: "test@mail.com" },
          },
        },
      },
    }).as("loginMutation");
    cy.contains("Continue").click();
    cy.contains("Logging in...").should("be.visible");
    cy.wait("@loginMutation");
  });
  it("should handle create account button", () => {
    cy.get('button[type="button"]').contains('Create an account').should('be.visible');
  });
});