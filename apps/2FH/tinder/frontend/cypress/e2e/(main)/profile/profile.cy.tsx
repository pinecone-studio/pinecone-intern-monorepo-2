describe('ProfilePage E2E Tests', () => {
    beforeEach(() => {
      cy.visit('/'); // Assumes ProfilePage is served at root
      cy.window().then((win) => {
        // Mock URL.createObjectURL for file uploads
        cy.stub(win.URL, 'createObjectURL').returns('mocked-url');
      });
    });
  
    it('loads the profile page with profile section active', () => {
      cy.get('header').should('exist'); // TinderHeader
      cy.contains('tinder').should('be.visible'); // Footer logo
      cy.contains('© Copyright 2024').should('be.visible'); // Footer copyright
      cy.contains('Personal Information').should('be.visible'); // ProfileSection
      cy.contains('Profile Images').should('not.exist'); // ImagesSection hidden
    });
  
    it('switches to images section and back to profile', () => {
      cy.contains('Images').click(); // TinderNavigation
      cy.contains('Profile Images').should('be.visible');
      cy.contains('Personal Information').should('not.exist');
      cy.contains('Add Image').should('be.visible'); // ImagesSection content
      cy.contains('Profile').click(); // Switch back
      cy.contains('Personal Information').should('be.visible');
      cy.contains('Profile Images').should('not.exist');
    });
  
    it('uploads an image and triggers notification', () => {
      cy.contains('Images').click();
      const fileName = 'test.jpg';
      // Use standard Cypress file upload
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from('fake-image-content'),
        fileName: fileName,
        mimeType: 'image/jpeg',
        lastModified: Date.now(),
      });
      cy.contains('Image uploaded successfully').should('be.visible');
      // Look for notification by message content instead of testid
      cy.contains('Image uploaded successfully').should('be.visible');
      cy.wait(3500); // Wait for notification auto-dismiss (3s + buffer)
      cy.contains('Image uploaded successfully').should('not.exist');
    });
  
    it('deletes an image and triggers notification', () => {
      cy.contains('Images').click();
      cy.get('[title="Delete image"]').first().click();
      cy.contains('Image deleted successfully').should('be.visible');
      cy.contains('Image deleted successfully').should('be.visible');
      cy.get('[title="Delete image"]').should('have.length', 5); // 6 initial - 1
    });
  
    it('saves images and triggers notification', () => {
      cy.contains('Images').click();
      cy.contains('Save Images').click();
      cy.contains('Images saved successfully').should('be.visible');
      cy.contains('Images saved successfully').should('be.visible');
    });
  
    it('handles profile section save', () => {
      cy.contains('Update profile').click(); // Use actual button text
      cy.contains('Profile Updated Successfully').should('be.visible');
      cy.contains('Profile Updated Successfully').should('be.visible');
    });
  
    it('closes notification manually', () => {
      cy.contains('Images').click();
      cy.contains('Save Images').click();
      cy.contains('Images saved successfully').should('be.visible');
      // Look for close button by finding the notification and then the close button within it
      cy.contains('Images saved successfully').parent().find('button[aria-label="Close"]').click();
      cy.contains('Images saved successfully').should('not.exist');
    });
  });