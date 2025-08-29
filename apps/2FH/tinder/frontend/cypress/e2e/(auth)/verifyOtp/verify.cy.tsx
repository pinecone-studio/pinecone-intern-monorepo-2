describe("Verify OTP Verification Tests", () => {
  const otpInputs = () => cy.get("[data-cy^='otp-input-']");

  beforeEach(() => {
    cy.clock();
    cy.visit("/verifyOtp?email=test@mail.com", { timeout: 10000 });
  });

  it("shows toast on verifyOtp server/network error", () => {
    otpInputs().each((input, idx) => cy.wrap(input).type((idx + 1).toString()));
    
    cy.intercept("POST", "/api/graphql", { forceNetworkError: true }).as("verifyOtpError");
    
    cy.tick(50);
    cy.wait("@verifyOtpError", { timeout: 10000 });
    
    cy.get(".sonner-toast, [data-cy='toast-error'], .toast", { timeout: 5000 })
      .should("contain.text", "Something went wrong");
  });

  it("shows error on wrong OTP", () => {
    otpInputs().each((input) => cy.wrap(input).type("9"));
  
    cy.intercept("POST", "/api/graphql", {
      body: { data: { verifyOtp: { status: "ERROR", message: "Wrong OTP" } } },
    }).as("verifyOtpFail");
  
    otpInputs().last().blur();
    cy.wait("@verifyOtpFail", { timeout: 10000 });
    
    cy.get(".sonner-toast, [data-cy='toast-error'], .toast", { timeout: 5000 })
      .should("contain.text", "Wrong OTP");
  });

  it("shows fallback error message when verifyOtp fails without specific message", () => {
    otpInputs().each((input, idx) => cy.wrap(input).type((idx + 1).toString()));

    cy.intercept("POST", "/api/graphql", {
      body: { data: { verifyOtp: { status: "ERROR", message: null } } },
    }).as("verifyOtpFail");

    cy.tick(50);
    cy.wait("@verifyOtpFail", { timeout: 10000 });
    cy.get(".sonner-toast, [data-cy='toast-error'], .toast", { timeout: 5000 })
      .should("contain.text", "Failed to verify OTP");
  });

  it("shows specific error message when verifyOtp fails with message", () => {
    otpInputs().each((input, idx) => cy.wrap(input).type((idx + 1).toString()));

    cy.intercept("POST", "/api/graphql", {
      body: { data: { verifyOtp: { status: "ERROR", message: "Invalid OTP code" } } },
    }).as("verifyOtpFail");

    cy.tick(50);
    cy.wait("@verifyOtpFail", { timeout: 10000 });
    cy.get(".sonner-toast, [data-cy='toast-error'], .toast", { timeout: 5000 })
      .should("contain.text", "Invalid OTP code");
  });
}); 