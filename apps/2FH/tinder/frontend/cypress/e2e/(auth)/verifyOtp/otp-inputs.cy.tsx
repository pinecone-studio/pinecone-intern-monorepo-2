describe("OTP Inputs Component Tests", () => {
  const otpInputs = () => cy.get("[data-cy^='otp-input-']");

  beforeEach(() => {
    cy.clock();
    cy.visit("/verifyOtp?email=test@mail.com", { 
      timeout: 10000,
      failOnStatusCode: false 
    });
  });

  it("renders all 4 OTP input fields", () => {
    otpInputs().should("have.length", 4);
    otpInputs().each((input) => {
      cy.wrap(input).should("be.visible");
      cy.wrap(input).should("have.attr", "type", "text");
      cy.wrap(input).should("have.attr", "maxlength", "1");
    });
  });

  it("handles input focus and selection", () => {
    otpInputs().eq(0).focus();
    otpInputs().eq(0).should("have.focus");
  });

  it("handles input with single digit", () => {
    otpInputs().eq(0).type("5");
    otpInputs().eq(0).should("have.value", "5");
  });

  it("handles input with multiple digits (only first digit accepted)", () => {
    otpInputs().eq(0).type("123");
    otpInputs().eq(0).should("have.value", "1");
  });

  it("handles non-digit input (should be ignored)", () => {
    otpInputs().eq(0).type("a");
    otpInputs().eq(0).should("have.value", "");
  });

  it("handles special characters (should be ignored)", () => {
    otpInputs().eq(0).type("@#$");
    otpInputs().eq(0).should("have.value", "");
  });

  it("handles backspace on empty input", () => {
    otpInputs().eq(1).type("2");
    otpInputs().eq(1).type("{backspace}");
    otpInputs().eq(0).should("have.focus");
  });

  it("handles backspace on filled input", () => {
    otpInputs().eq(0).type("1");
    otpInputs().eq(0).type("{backspace}");
    otpInputs().eq(0).should("have.value", "");
  });

  it("handles focus navigation between inputs", () => {
    otpInputs().eq(0).type("1");
    otpInputs().eq(1).should("have.focus");
    otpInputs().eq(1).type("2");
    otpInputs().eq(2).should("have.focus");
  });

  it("handles all inputs with complete OTP", () => {
    otpInputs().each((input, idx) => {
      cy.wrap(input).type((idx + 1).toString());
    });
    otpInputs().each((input, idx) => {
      cy.wrap(input).should("have.value", (idx + 1).toString());
    });
  });

  it("handles input clearing", () => {
    otpInputs().eq(0).type("1");
    otpInputs().eq(0).clear();
    otpInputs().eq(0).should("have.value", "");
  });

  it("handles input with zero", () => {
    otpInputs().eq(0).type("0");
    otpInputs().eq(0).should("have.value", "0");
  });

  it("handles input with nine", () => {
    otpInputs().eq(0).type("9");
    otpInputs().eq(0).should("have.value", "9");
  });
});