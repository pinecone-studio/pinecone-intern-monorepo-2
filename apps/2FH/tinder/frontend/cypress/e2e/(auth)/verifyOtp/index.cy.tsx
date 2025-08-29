// cypress/e2e/verify-otp.spec.ts
describe("Verify OTP Page with data-cy", () => {
  const otpInputs = () => cy.get("[data-cy^='otp-input-']");

  beforeEach(() => {
    cy.clock();
    cy.visit("/verifyOtp?email=test@mail.com");
  
    cy.get("body").should("be.visible");
  });

  it("renders all elements", () => {

    cy.get("[data-cy='verify-otp-title']").should("be.visible");
    cy.get("[data-cy='verify-otp-description']").should("contain.text", "To continue, enter the secure code");
    otpInputs().should("have.length", 4);
    cy.get("[data-cy='resend-otp']").should("be.visible");
  });

  it("successfully verifies OTP", () => {
    cy.clock();
    

    otpInputs().each((input, idx) => {
      cy.wrap(input).type((idx + 1).toString());
    });
  
    cy.intercept("POST", "/api/graphql", {
      body: { data: { verifyOtp: { status: "SUCCESS", message: "OTP verified successfully" } } },
    }).as("verifyOtpSuccess");
  
    cy.tick(100); 
    cy.wait("@verifyOtpSuccess");
    
  
    cy.get(".sonner-toast").should("contain.text", "OTP verified successfully");
    
    cy.url().should("include", "/resetPassword");
  });
  
  it("shows toast on verifyOtp server/network error", () => {
  
    otpInputs().each((input, idx) => {
      cy.wrap(input).type((idx + 1).toString());
    });
    

    cy.intercept("POST", "/api/graphql", { forceNetworkError: true }).as("verifyOtpError");
    
    cy.tick(100); 
    cy.wait("@verifyOtpError");
    
    cy.get(".sonner-toast").should("contain.text", "Something went wrong");
  });

  it("ignores non-digit input in OTP", () => {
  
    otpInputs().eq(0).type("a");
    
 
    otpInputs().eq(0).should("have.value", "");
  });
  
  it("shows error on wrong OTP", () => {
  
    otpInputs().each((input) => {
      cy.wrap(input).type("9");
    });
  
  
    cy.intercept("POST", "/api/graphql", {
      body: { data: { verifyOtp: { status: "ERROR", message: "Wrong OTP" } } },
    }).as("verifyOtpFail");
  

    otpInputs().last().blur();
    cy.wait("@verifyOtpFail");
    
  
    cy.get(".sonner-toast").should("contain.text", "Wrong OTP");
  });

  it("shows fallback error message when verifyOtp fails without specific message", () => {
    
    otpInputs().each((input, idx) => {
      cy.wrap(input).type((idx + 1).toString());
    });

    cy.intercept("POST", "/api/graphql", {
      body: { data: { verifyOtp: { status: "ERROR", message: null } } },
    }).as("verifyOtpFail");

    cy.tick(100); 
    cy.wait("@verifyOtpFail");
    
  
    cy.get(".sonner-toast").should("contain.text", "Failed to verify OTP");
  });

  it("shows specific error message when verifyOtp fails with message", () => {
  
    otpInputs().each((input, idx) => {
      cy.wrap(input).type((idx + 1).toString());
    });


    cy.intercept("POST", "/api/graphql", {
      body: { data: { verifyOtp: { status: "ERROR", message: "Invalid OTP code" } } },
    }).as("verifyOtpFail");

    cy.tick(100); 
    cy.wait("@verifyOtpFail");
    

    cy.get(".sonner-toast").should("contain.text", "Invalid OTP code");
  });

  it("handles backspace and focus", () => {
  
    otpInputs().eq(0).type("1");
    
    otpInputs().eq(1).type("2{backspace}");
    
    
    otpInputs().eq(0).should("have.focus");
  });
});
