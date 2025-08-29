describe("Verify OTP Resend Tests", () => {
  const otpInputs = () => cy.get("[data-cy^='otp-input-']");

  beforeEach(() => {
    cy.clock();
    cy.visit("/verifyOtp?email=test@mail.com", { timeout: 10000 });
  });

  it("resends OTP successfully after timer", () => {
    cy.tick(15000);
    cy.get("[data-cy='resend-otp']", { timeout: 5000 }).should("be.visible");
  
    cy.intercept("POST", "/api/graphql", {
      body: { data: { forgotPassword: { status: "SUCCESS", message: "OTP resent successfully!" } } },
    }).as("resendOtp");
  
    cy.get("[data-cy='resend-otp']").click();
    cy.wait("@resendOtp", { timeout: 10000 });
    
    cy.get(".sonner-toast, [data-cy='toast-success'], .toast", { timeout: 5000 })
      .should("contain.text", "OTP resent successfully!");
  });

  it("handles resend OTP network/server error", () => {
    cy.tick(15000);
    
    cy.intercept("POST", "/api/graphql", { forceNetworkError: true }).as("resendOtpError");
    
    cy.get("[data-cy='resend-otp']").click();
    cy.wait("@resendOtpError", { timeout: 10000 });
    
    cy.get(".sonner-toast, [data-cy='toast-error'], .toast", { timeout: 5000 })
      .should("contain.text", "Failed to resend OTP");
  });

  it("handles resend OTP failure", () => {
    cy.tick(15000);
    cy.intercept("POST", "/api/graphql", {
      body: { data: { forgotPassword: { status: "ERROR", message: "Failed to resend OTP" } } },
    }).as("resendOtpFail");

    cy.get("[data-cy='resend-otp']").click();
    cy.wait("@resendOtpFail", { timeout: 10000 });
    
    cy.get(".sonner-toast, [data-cy='toast-error'], .toast", { timeout: 5000 })
      .should("contain.text", "Failed to resend OTP");
  });

  it("handles resend OTP failure with custom message", () => {
    cy.tick(15000);
    cy.intercept("POST", "/api/graphql", {
      body: { data: { forgotPassword: { status: "ERROR", message: "Custom error message" } } },
    }).as("resendOtpFail");

    cy.get("[data-cy='resend-otp']").click();
    cy.wait("@resendOtpFail", { timeout: 10000 });
    
    cy.get(".sonner-toast, [data-cy='toast-error'], .toast", { timeout: 5000 })
      .should("contain.text", "Custom error message");
  });

  it("shows fallback error message when resend OTP fails without specific message", () => {
    cy.tick(15000);
    cy.intercept("POST", "/api/graphql", {
      body: { data: { forgotPassword: { status: "ERROR", message: null } } },
    }).as("resendOtpFailNoMessage");

    cy.get("[data-cy='resend-otp']").click();
    cy.wait("@resendOtpFailNoMessage", { timeout: 10000 });
    
    cy.get(".sonner-toast, [data-cy='toast-error'], .toast", { timeout: 5000 })
      .should("contain.text", "Failed to resend OTP");
  });

  it("enables resend button when timer reaches exactly 0", () => {
    // Timer starts at 15, tick to exactly 0
    cy.tick(15000);
    cy.get("[data-cy='resend-otp']").should("be.visible");
  });

  it("decrements timer correctly when timer is greater than 0", () => {
    // Timer starts at 15, tick to 10 seconds
    cy.tick(5000);
    
    // The timer should still be running and not show resend button
    cy.get("[data-cy='resend-otp']").should("not.exist");
  });

  it("handles console error in resend OTP catch block", () => {
    cy.tick(15000);
    
    cy.window().then((win) => {
      cy.spy(win.console, 'error').as('consoleError');
    });
    
    cy.intercept("POST", "/api/graphql", { forceNetworkError: true }).as("resendOtpNetworkError");
    
    cy.get("[data-cy='resend-otp']").click();
    cy.wait("@resendOtpNetworkError", { timeout: 10000 });
    
    cy.get('@consoleError').should('have.been.called');
  });

  it("clears OTP inputs when resending", () => {
    otpInputs().each((input, idx) => cy.wrap(input).type((idx + 1).toString()));
    cy.tick(15000);

    cy.intercept("POST", "/api/graphql", {
      body: { data: { forgotPassword: { status: "SUCCESS", message: "OTP resent successfully!" } } },
    }).as("resendOtpClear");

    cy.get("[data-cy='resend-otp']").click();
    cy.wait("@resendOtpClear", { timeout: 10000 });
    otpInputs().each((input) => cy.wrap(input).should("have.value", ""));
  });
}); 