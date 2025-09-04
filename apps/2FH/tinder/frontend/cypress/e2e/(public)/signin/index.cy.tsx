// cypress/e2e/login.spec.ts
describe("Login Page", () => {
  const typeEmail = (email: string) => {
    cy.get("[data-cy='email-input']").clear().type(email);
  };

  const typePassword = (password: string) => {
    cy.get("[data-cy='password-input']").clear().type(password);
  };

  const clickContinue = () => cy.get("[data-cy='continue-button']").click();

  const mockLogin = (overrides = {}) => ({
    statusCode: 200,
    body: {
      data: {
        login: {
          status: "SUCCESS",
          message: "Login successful!",
          token: "fake-token-123",
          user: { id: "1", email: "test@mail.com" },
          ...overrides,
        },
      },
    },
  });

  beforeEach(() => {
    cy.visit("/signin");
  });

  context("Success Scenarios", () => {
    it("logs in successfully", () => {
      typeEmail("test@mail.com");
      typePassword("123456");

      cy.intercept("POST", "/api/graphql", mockLogin()).as("loginMutation");

      clickContinue();
      cy.wait("@loginMutation");

      cy.get("[data-cy='login-success']")
        .should("be.visible")
        .and("contain.text", "Login successful!");

      cy.window().then((win) => {
        expect(win.localStorage.getItem("token")).to.eq("fake-token-123");
      });
    });

    it("logs in successfully with empty message", () => {
      typeEmail("test@mail.com");
      typePassword("123456");

      cy.intercept("POST", "/api/graphql", mockLogin({ message: "" })).as("loginMutationEmpty");

      clickContinue();
      cy.wait("@loginMutationEmpty");

      cy.window().then((win) => {
        expect(win.localStorage.getItem("token")).to.eq("fake-token-123");
      });
    });
  });

  context("Error Scenarios", () => {
    it("shows error when login fails", () => {
      typeEmail("wrong@mail.com");
      typePassword("wrongpass");

      cy.intercept("POST", "/api/graphql", mockLogin({ status: "ERROR", message: "Invalid credentials", token: null, user: null }))
        .as("loginFail");

      clickContinue();
      cy.wait("@loginFail");

      cy.get("[data-cy='login-error']").should("be.visible").and("contain.text", "Invalid credentials");
    });

    it("shows 'Login failed' when error message is empty", () => {
      typeEmail("empty@message.com");
      typePassword("123456");

      cy.intercept("POST", "/api/graphql", mockLogin({ status: "ERROR", message: null, token: null, user: null }))
        .as("loginNoMessage");

      clickContinue();
      cy.wait("@loginNoMessage");

      cy.get("[data-cy='login-error']").should("contain.text", "Login failed");
    });

    it("handles Apollo/network error", () => {
      typeEmail("test@mail.com");
      typePassword("123456");

      cy.intercept("POST", "/api/graphql", { forceNetworkError: true }).as("networkError");

      clickContinue();
      cy.wait("@networkError");

      cy.get("[data-cy='login-apollo-error']")
        .should("be.visible")
        .and("contain.text", "Something went wrong during login.");
    });

    it("handles unexpected status", () => {
      typeEmail("unknown@mail.com");
      typePassword("123456");

      cy.intercept("POST", "/api/graphql", mockLogin({ status: "UNKNOWN", message: null, token: null, user: null }))
        .as("loginUnknown");

      clickContinue();
      cy.wait("@loginUnknown");

      cy.get("[data-cy='login-error']").should("contain.text", "Login failed");
    });
  });

  context("UI & Validation", () => {
    it("shows validation errors when fields are empty", () => {
      clickContinue();
      cy.get("[data-cy='email-error']").should("contain.text", "Email is required");
      cy.get("[data-cy='password-error']").should("contain.text", "Password is required");
    });

    it("shows loading state during login", () => {
      typeEmail("test@mail.com");
      typePassword("123456");

      cy.intercept("POST", "/api/graphql", { ...mockLogin(), delay: 500 }).as("loginLoading");

      clickContinue();
      cy.get("[data-cy='continue-button']").should("contain.text", "Logging in...");
      cy.wait("@loginLoading");
    });

    it("renders forgot password link", () => {
      cy.get("[data-cy='forgot-password']").should("be.visible").and("contain.text", "Forgot password?");
    });

    it("renders create account button", () => {
      cy.get("[data-cy='create-account']").should("be.visible");
    });

    it("renders OR divider", () => {
      cy.contains("OR").should("be.visible");
    });
  });
});