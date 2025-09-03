describe('User Profile Page', () => {
  beforeEach(() => {
    // Visit the profile page before each test
    cy.visit('/profile');
  });

  describe('Page Structure and Navigation', () => {
    it('should display the main profile page with correct header and footer', () => {
      // Check header elements
      cy.get('header').should('be.visible');
      cy.get('header').within(() => {
        cy.get('span').contains('Pedia').should('be.visible');
        cy.get('a').contains('My Booking').should('be.visible');
        cy.get('a').contains('Shagai').should('be.visible');
      });

      // Check footer
      cy.get('footer').should('be.visible');
      cy.get('footer').within(() => {
        cy.get('span').contains('Pedia').should('be.visible');
      });
    });

    it('should display user greeting with correct information', () => {
      cy.get('h1').contains('Hi, Shagai').should('be.visible');
      cy.get('p').contains('n.shagai@pinecone.mn').should('be.visible');
    });

    it('should display all navigation tabs in the sidebar', () => {
      const expectedTabs = ['Profile', 'Account', 'Appearance', 'Notifications', 'Display'];
      
      expectedTabs.forEach(tab => {
        cy.get('button').contains(tab).should('be.visible');
      });
    });

    it('should have Profile tab active by default', () => {
      cy.get('button').contains('Profile')
        .should('have.class', 'bg-gray-100')
        .and('have.class', 'text-gray-900');
    });
  });

  describe('Tab Navigation', () => {
    it('should switch between tabs and update active state', () => {
      const tabs = ['Account', 'Appearance', 'Notifications', 'Display'];
      
      tabs.forEach(tab => {
        // Click on the tab
        cy.get('button').contains(tab).click();
        
        // Check that the clicked tab is now active
        cy.get('button').contains(tab)
          .should('have.class', 'bg-gray-100')
          .and('have.class', 'text-gray-900');
        
        // Check that other tabs are not active
        tabs.filter(t => t !== tab).forEach(otherTab => {
          cy.get('button').contains(otherTab)
            .should('not.have.class', 'bg-gray-100');
        });
        
        // Verify the content area shows the correct tab content
        cy.get('h2').contains(tab).should('be.visible');
      });
    });

    it('should return to Profile tab and show personal information form', () => {
      // First navigate to another tab
      cy.get('button').contains('Account').click();
      cy.get('h2').contains('Account Settings').should('be.visible');
      
      // Navigate back to Profile tab
      cy.get('button').contains('Profile').click();
      cy.get('h2').contains('Personal Information').should('be.visible');
    });
  });

  describe('Personal Information Form', () => {
    it('should display the personal information form with all fields', () => {
      // Ensure we're on the Profile tab
      cy.get('button').contains('Profile').click();
      
      // Check form elements
      cy.get('form').should('be.visible');
      cy.get('label').contains('First Name').should('be.visible');
      cy.get('label').contains('Last Name').should('be.visible');
      cy.get('label').contains('Date of birth').should('be.visible');
      
      // Check input fields
      cy.get('#firstName').should('be.visible');
      cy.get('#lastName').should('be.visible');
      cy.get('#dateOfBirth').should('be.visible');
      
      // Check Update Profile button
      cy.get('button').contains('Update Profile').should('be.visible');
    });

    it('should allow entering data in form fields', () => {
      // Ensure we're on the Profile tab
      cy.get('button').contains('Profile').click();
      
      // Enter data in form fields
      cy.get('#firstName').type('John');
      cy.get('#lastName').type('Doe');
      cy.get('#dateOfBirth').type('1990-01-01');
      
      // Verify the data was entered
      cy.get('#firstName').should('have.value', 'John');
      cy.get('#lastName').should('have.value', 'Doe');
      cy.get('#dateOfBirth').should('have.value', '1990-01-01');
    });

    it('should handle form submission', () => {
      // Ensure we're on the Profile tab
      cy.get('button').contains('Profile').click();
      
      // Fill out the form
      cy.get('#firstName').type('Jane');
      cy.get('#lastName').type('Smith');
      cy.get('#dateOfBirth').type('1985-05-15');
      
      // Submit the form
      cy.get('form').submit();
      
      // The form submission should be handled (we can't easily test console.log in E2E)
      // But we can verify the form is still visible and functional
      cy.get('form').should('be.visible');
    });
  });

  describe('Update Profile Functionality', () => {
    it('should open UpdateContact component when Update Profile button is clicked', () => {
      // Ensure we're on the Profile tab
      cy.get('button').contains('Profile').click();
      
      // Click Update Profile button
      cy.get('button').contains('Update Profile').click();
      
      // Verify UpdateContact component is displayed
      cy.get('h2').contains('Contact info').should('be.visible');
      cy.get('h2').contains('Emergency Contact').should('be.visible');
      cy.get('button').contains('Update profile').should('be.visible');
    });

    it('should display contact information form in UpdateContact component', () => {
      // Navigate to UpdateContact component
      cy.get('button').contains('Profile').click();
      cy.get('button').contains('Update Profile').click();
      
      // Check contact info form elements
      cy.get('label').contains('Phone number').should('be.visible');
      cy.get('label').contains('Email address').should('be.visible');
      
      // Check that phone number input has country code selector
      cy.get('input[placeholder="Enter phone number"]').should('be.visible');
      cy.get('input[placeholder="Enter email address"]').should('be.visible');
    });

    it('should display emergency contact form in UpdateContact component', () => {
      // Navigate to UpdateContact component
      cy.get('button').contains('Profile').click();
      cy.get('button').contains('Update Profile').click();
      
      // Check emergency contact form elements
      cy.get('label').contains('Relationship').should('be.visible');
      
      // Check relationship dropdown
      cy.get('button[role="combobox"]').should('be.visible');
      
      // Check that there are two phone number inputs (contact + emergency)
      cy.get('input[placeholder="Enter phone number"]').should('have.length', 2);
    });

    it('should handle relationship selection in emergency contact form', () => {
      // Navigate to UpdateContact component
      cy.get('button').contains('Profile').click();
      cy.get('button').contains('Update Profile').click();
      
      // Open relationship dropdown
      cy.get('button[role="combobox"]').click();
      
      // Select a relationship option
      cy.get('[role="option"]').contains('Parent').click();
      
      // Verify selection
      cy.get('button[role="combobox"]').should('contain', 'Parent');
    });

    it('should show additional input field when "Other" relationship is selected', () => {
      // Navigate to UpdateContact component
      cy.get('button').contains('Profile').click();
      cy.get('button').contains('Update Profile').click();
      
      // Open relationship dropdown and select "Other"
      cy.get('button[role="combobox"]').click();
      cy.get('[role="option"]').contains('Other').click();
      
      // Verify additional input field appears
      cy.get('input[placeholder="Please specify relationship"]').should('be.visible');
      
      // Enter text in the additional field
      cy.get('input[placeholder="Please specify relationship"]').type('Cousin');
      cy.get('input[placeholder="Please specify relationship"]').should('have.value', 'Cousin');
    });

    it('should navigate to UpdateSettings when Update profile button is clicked', () => {
      // Navigate to UpdateContact component
      cy.get('button').contains('Profile').click();
      cy.get('button').contains('Update Profile').click();
      
      // Click the Update profile button in UpdateContact
      cy.get('button').contains('Update profile').click();
      
      // Verify we're now in UpdateSettings component
      // The UpdateSettings component should be displayed
      // (We can't easily test the specific content without knowing what UpdateSettings shows)
      cy.get('button').contains('Update profile').should('not.exist');
    });
  });

  describe('Form Validation and User Experience', () => {
    it('should maintain form state when switching between tabs', () => {
      // Ensure we're on the Profile tab
      cy.get('button').contains('Profile').click();
      
      // Enter data in form
      cy.get('#firstName').type('Test');
      cy.get('#lastName').type('User');
      
      // Switch to another tab
      cy.get('button').contains('Account').click();
      cy.get('h2').contains('Account Settings').should('be.visible');
      
      // Switch back to Profile tab
      cy.get('button').contains('Profile').click();
      
      // Verify form data is preserved
      cy.get('#firstName').should('have.value', 'Test');
      cy.get('#lastName').should('have.value', 'User');
    });

    it('should have proper focus states on form inputs', () => {
      // Ensure we're on the Profile tab
      cy.get('button').contains('Profile').click();
      
      // Test focus on first name input
      cy.get('#firstName').focus();
      cy.get('#firstName').should('have.class', 'focus:ring-2');
      
      // Test focus on last name input
      cy.get('#lastName').focus();
      cy.get('#lastName').should('have.class', 'focus:ring-2');
      
      // Test focus on date of birth input
      cy.get('#dateOfBirth').focus();
      cy.get('#dateOfBirth').should('have.class', 'focus:ring-2');
    });

    it('should display helpful text and descriptions', () => {
      // Ensure we're on the Profile tab
      cy.get('button').contains('Profile').click();
      
      // Check for helpful descriptions
      cy.get('p').contains('This is how others will see you on the site.').should('be.visible');
      cy.get('p').contains('Your date of birth is used to calculate your age.').should('be.visible');
    });
  });

  describe('Responsive Design', () => {
    it('should display properly on different screen sizes', () => {
      // Test mobile viewport
      cy.viewport('iphone-x');
      cy.get('header').should('be.visible');
      cy.get('footer').should('be.visible');
      
      // Test tablet viewport
      cy.viewport('ipad-2');
      cy.get('header').should('be.visible');
      cy.get('footer').should('be.visible');
      
      // Test desktop viewport
      cy.viewport(1920, 1080);
      cy.get('header').should('be.visible');
      cy.get('footer').should('be.visible');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      // Ensure we're on the Profile tab
      cy.get('button').contains('Profile').click();
      
      // Check that form inputs have proper labels
      cy.get('#firstName').should('have.attr', 'id');
      cy.get('label[for="firstName"]').should('exist');
      
      cy.get('#lastName').should('have.attr', 'id');
      cy.get('label[for="lastName"]').should('exist');
      
      cy.get('#dateOfBirth').should('have.attr', 'id');
      cy.get('label[for="dateOfBirth"]').should('exist');
    });

    it('should convert first letter to uppercase and rest to lowercase in name fields', () => {
      // Ensure we're on the Profile tab
      cy.get('button').contains('Profile').click();
      
      // Type all lowercase letters in first name
      cy.get('#firstName').type('john');
      cy.get('#firstName').should('have.value', 'John');
      
      // Type all uppercase letters in last name
      cy.get('#lastName').type('DOE');
      cy.get('#lastName').should('have.value', 'Doe');
      
      // Type mixed case letters
      cy.get('#firstName').clear().type('jOhN dOe');
      cy.get('#firstName').should('have.value', 'John Doe');
    });

    it('should show correct placeholder text for name fields', () => {
      // Ensure we're on the Profile tab
      cy.get('button').contains('Profile').click();
      
      // Check placeholder text
      cy.get('#firstName').should('have.attr', 'placeholder', 'Write your first name');
      cy.get('#lastName').should('have.attr', 'placeholder', 'Write your last name');
    });

    it('should show error messages when Update Profile is clicked without filling required fields', () => {
      // Ensure we're on the Profile tab
      cy.get('button').contains('Profile').click();
      
      // Click Update Profile without filling any fields
      cy.get('button').contains('Update Profile').click();
      
      // Verify error messages are shown
      cy.get('p').contains('Fill in your first name').should('be.visible');
      cy.get('p').contains('Fill in your last name').should('be.visible');
      cy.get('p').contains('Fill in your date of birth').should('be.visible');
      
      // Verify we're still on the same page (UpdateContact should not be shown)
      cy.get('h2').contains('Personal Information').should('be.visible');
      cy.get('h2').contains('Contact info').should('not.exist');
    });

    it('should show error messages for all required fields in UpdateContact', () => {
      // Ensure we're on the Profile tab
      cy.get('button').contains('Profile').click();
      
      // Fill required fields and navigate to UpdateContact
      cy.get('#firstName').type('John');
      cy.get('#lastName').type('Doe');
      cy.get('#dateOfBirth').type('1990-01-01');
      cy.get('button').contains('Update Profile').click();
      
      // Now we should be in UpdateContact
      cy.get('h2').contains('Contact info').should('be.visible');
      
      // Click Update profile without filling contact fields
      cy.get('button').contains('Update profile').click();
      
      // Verify error messages for contact fields
      cy.get('p').contains('Fill in your phone number').should('be.visible');
      cy.get('p').contains('Fill in your contact email').should('be.visible');
      cy.get('p').contains('Fill in emergency contact phone number').should('be.visible');
      cy.get('p').contains('Select relationship').should('be.visible');
    });

    it('should clear error messages when user starts typing', () => {
      // Ensure we're on the Profile tab
      cy.get('button').contains('Profile').click();
      
      // Click Update Profile without filling any fields to trigger errors
      cy.get('button').contains('Update Profile').click();
      
      // Verify error messages are shown
      cy.get('p').contains('Fill in your first name').should('be.visible');
      cy.get('p').contains('Fill in your date of birth').should('be.visible');
      
      // Start typing in first name field
      cy.get('#firstName').type('John');
      
      // Verify error message is cleared
      cy.get('p').contains('Fill in your first name').should('not.exist');
      
      // Start typing in date of birth field
      cy.get('#dateOfBirth').type('1990-01-01');
      
      // Verify error message is cleared
      cy.get('p').contains('Fill in your date of birth').should('not.exist');
    });

    it('should navigate to next page only when all required fields are filled', () => {
      // Ensure we're on the Profile tab
      cy.get('button').contains('Profile').click();
      
      // Fill only first name
      cy.get('#firstName').type('John');
      cy.get('button').contains('Update Profile').click();
      
      // Should still show error for last name and date of birth
      cy.get('p').contains('Fill in your last name').should('be.visible');
      cy.get('p').contains('Fill in your date of birth').should('be.visible');
      cy.get('h2').contains('Personal Information').should('be.visible');
      
      // Fill last name as well
      cy.get('#lastName').type('Doe');
      cy.get('button').contains('Update Profile').click();
      
      // Should still show error for date of birth
      cy.get('p').contains('Fill in your date of birth').should('be.visible');
      cy.get('h2').contains('Personal Information').should('be.visible');
      
      // Fill date of birth as well
      cy.get('#dateOfBirth').type('1990-01-01');
      cy.get('button').contains('Update Profile').click();
      
      // Now should navigate to next page
      cy.get('h2').contains('Contact info').should('be.visible');
    });

    it('should be navigable via keyboard', () => {
      // Ensure we're on the Profile tab
      cy.get('button').contains('Profile').click();
      
      // Test keyboard navigation by focusing on elements
      cy.get('#firstName').focus();
      cy.focused().should('have.id', 'firstName');
      
      cy.get('#lastName').focus();
      cy.focused().should('have.id', 'lastName');
      
      cy.get('#dateOfBirth').focus();
      cy.focused().should('have.id', 'dateOfBirth');
    });
  });
});
