
describe("Verify OTP Page with data-cy", () => {
  const otpInputs = () => cy.get("[data-cy^='otp-input-']");

  beforeEach(() => {
    cy.clock();
    cy.visit("/verifyOtp?email=test@mail.com", { timeout: 10000 });
  });

  it("renders all elements", () => {
    cy.get("[data-cy='verify-otp-title']", { timeout: 5000 }).should("be.visible");
    cy.get("[data-cy='verify-otp-description']", { timeout: 5000 }).should("contain.text", "To continue, enter the secure code");
    otpInputs().should("have.length", 4);
    cy.get("[data-cy='resend-otp']", { timeout: 5000 }).should("be.visible");
  });

  it("successfully verifies OTP", () => {
    cy.clock();
    otpInputs().each((input, idx) => cy.wrap(input).type((idx + 1).toString()));
  
    cy.intercept("POST", "/api/graphql", {
      body: { data: { verifyOtp: { status: "SUCCESS", message: "OTP verified successfully" } } },
    }).as("verifyOtpSuccess");
  
    cy.tick(50);
    cy.wait("@verifyOtpSuccess", { timeout: 10000 });
    
    cy.get(".sonner-toast, [data-cy='toast-success'], .toast", { timeout: 5000 })
      .should("contain.text", "OTP verified successfully");
    
    cy.url().should("include", "/resetPassword");
  });

  it("ignores non-digit input in OTP", () => {
    otpInputs().eq(0).type("a");
    otpInputs().eq(0).should("have.value", "");
  });

  it("handles backspace and focus", () => {
    otpInputs().eq(0).type("1");
    otpInputs().eq(1).type("2{backspace}");
    otpInputs().eq(0).should("have.focus");
  });

  it("enables resend button when timer reaches exactly 0", () => {
    cy.tick(15000);
    cy.get("[data-cy='resend-otp']", { timeout: 5000 }).should("be.visible");
  });

  it("decrements timer correctly when timer is greater than 0", () => {
    cy.tick(5000);
    cy.get("[data-cy='resend-otp']").should("not.exist");
  });
});