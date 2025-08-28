

describe("Forgot Password Page", () => {
  beforeEach(() => {
    cy.visit("/forgotPassword");
  });

  it("should show validation error when email is empty", () => {
    cy.get("[data-cy='submit-button']").click();
    cy.get("[data-cy='email-error']").should("be.visible");
  });

  it("should send OTP successfully", () => {
    cy.get("[data-cy='email-input']").type("test@mail.com");

    cy.intercept("POST", "/api/graphql", {
      body: {
        data: {
          forgotPassword: {
            status: "SUCCESS",
            message: "OTP sent",
          },
        },
      },
    }).as("forgotPassword");

    cy.get("[data-cy='submit-button']").click();
    cy.wait("@forgotPassword");

    cy.get(".sonner-toast",{ timeout: 5000 }).should("contain.text", "OTP sent to your email");
    cy.location("pathname").should("eq", "/verifyOtp");
    cy.location("search").should("contain", "email=test@mail.com");
  });

  it("should show error when backend returns ERROR", () => {
    cy.get("[data-cy='email-input']").type("wrong@mail.com");

    cy.intercept("POST", "/api/graphql", {
      body: {
        data: {
          forgotPassword: {
            status: "ERROR",
            message: "User not found",
          },
        },
      },
    }).as("forgotPasswordError");

    cy.get("[data-cy='submit-button']").click();
    cy.wait("@forgotPasswordError");

    cy.get(".sonner-toast",{ timeout: 5000 }).should("contain.text", "User not found");
  });

  it("should show 'Failed to send OTP' when backend returns empty message", () => {
    cy.get("[data-cy='email-input']").type("empty@mail.com");

    cy.intercept("POST", "/api/graphql", {
      body: {
        data: {
          forgotPassword: {
            status: "ERROR",
            message: null,
          },
        },
      },
    }).as("forgotPasswordEmptyMsg");

    cy.get("[data-cy='submit-button']").click();
    cy.wait("@forgotPasswordEmptyMsg");

    cy.get(".sonner-toast",{ timeout: 5000 }).should("contain.text", "Failed to send OTP");
  });

  it("should show 'Something went wrong' when Apollo/server error occurs", () => {
    cy.get("[data-cy='email-input']").type("test@mail.com");

    cy.intercept("POST", "/api/graphql", {
      statusCode: 500,
      body: { errors: [{ message: "Internal server error" }] },
    }).as("apolloError");

    cy.get("[data-cy='submit-button']").click();
    cy.wait("@apolloError");

    cy.get(".sonner-toast").should("contain.text", "Something went wrong");
  });

  it("should show 'Something went wrong' when network error occurs", () => {
    cy.get("[data-cy='email-input']").type("test@mail.com");

    cy.intercept("POST", "/api/graphql", { forceNetworkError: true }).as("networkError");

    cy.get("[data-cy='submit-button']").click();
    cy.wait("@networkError");

    cy.get(".sonner-toast").should("contain.text", "Something went wrong");
  });

  it("should show 'Sending...' while request is in progress", () => {
    cy.get("[data-cy='email-input']").type("test@mail.com");

    cy.intercept("POST", "/api/graphql", {
      delay: 1000,
      body: {
        data: {
          forgotPassword: {
            status: "SUCCESS",
            message: "OTP sent",
          },
        },
      },
    }).as("forgotPasswordLoading");

    cy.get("[data-cy='submit-button']").click();
    cy.contains("Sending...").should("be.visible");
    cy.wait("@forgotPasswordLoading");
  });
});
