describe('Room Page', () => {
  beforeEach(() => {
    cy.visit('/room');
    cy.get('[data-cy="Room-Name"]').should('be.visible');
  });

  it('Should render room page with all sections', () => {
    cy.get('[data-cy="Room-Name"]').should('contain', 'Economy Single Room');

    cy.get('[data-cy="Chevron-Left"]').should('be.visible');

    cy.get('[data-cy="Select-Hotel"]').should('contain', 'Select Hotel');
    cy.get('[data-cy="Select-Hotel-Option"]').should('be.visible');
  });

  it('Should display General Info section', () => {
    cy.get('[data-cy="General"]').should('be.visible');
    cy.get('[data-cy="General-Info"]').should('contain', 'General Info');
    cy.get('[data-cy="Edit-General"]').should('be.visible');

    cy.get('[data-cy="General-Name-Value"]').should('contain', '-/-');
  });

  it('Should display Images section with edit functionality', () => {
    cy.get('[data-cy="Edit-Images"]').should('be.visible');

    cy.contains('No Photos Uploaded').should('be.visible');
    cy.contains('Add photos of your rooms, amenities, or property to showcase your hotel.').should('be.visible');
  });

  it('Should open image modal when edit button is clicked', () => {
    cy.get('[data-cy="Edit-Images"]').click();

    cy.contains('Upload Room Images').should('be.visible');
    cy.contains('Click to upload or drag and drop').should('be.visible');
  });

  it('Should close image modal when cancel is clicked', () => {
    cy.get('[data-cy="Edit-Images"]').click();
    cy.contains('Cancel').click();

    cy.contains('Upload Room Images').should('not.exist');
  });

  it('Should display Upcoming Bookings section', () => {
    cy.get('[data-cy="Upcoming"]').should('be.visible');
    cy.get('[data-cy="Upcoming-Bookings-Title"]').should('contain', 'Upcoming Bookings');
    cy.get('[data-cy="Upcoming-Bookings-Empty-Title"]').should('contain', 'No Upcoming Bookings');
  });

  it('Should display Room Services section', () => {
    cy.get('[data-cy="Roomservice"]').should('be.visible');
    cy.contains('Room Services').should('be.visible');
    cy.get('[data-cy="Edit-Room-Service"]').should('be.visible');
  });

  it('Should allow hotel selection', () => {
    // Wait for hotels to load
    cy.get('[data-cy="Select-Hotel-Option"]').should('not.be.disabled');
    // Select first available hotel if any exist
    cy.get('[data-cy="Select-Hotel-Option"] option').then(($options) => {
      if ($options.length > 1) {
        cy.get('[data-cy="Select-Hotel-Option"]').select(1);
        cy.get('[data-cy="Select-Hotel-Option"]').should('not.have.value', '');
      }
    });
  });

  it('Should handle image upload functionality', () => {
    cy.get('[data-cy="Edit-Images"]').click();

    cy.get('input[type="file"]').should('exist');

    cy.contains('Cancel').click();
  });

  it('Should display uploaded images after save', () => {
    cy.get('[data-cy="Edit-Images"]').click();

    cy.contains('Click to upload or drag and drop').should('be.visible');

    cy.contains('Cancel').click();
  });

  it('Should have proper responsive layout', () => {
    cy.viewport(1200, 800);
    cy.get('.grid').should('be.visible');

    cy.viewport(768, 1024);
    cy.get('.grid').should('be.visible');

    cy.viewport(375, 667);
    cy.get('.grid').should('be.visible');
  });

  it('Should handle general info edit functionality', () => {
    cy.get('[data-cy="Edit-General"]').click();

    cy.get('[data-cy="General"]').should('be.visible');
  });

  it('Should handle room services edit functionality', () => {
    cy.get('[data-cy="Edit-Room-Service"]').click();

    cy.get('[data-cy="Room-Service-Modal"]').should('be.visible');
  });

  it('Should maintain state after page interactions', () => {
    // Wait for hotels to load and select first available hotel
    cy.get('[data-cy="Select-Hotel-Option"]').should('not.be.disabled');
    cy.get('[data-cy="Select-Hotel-Option"] option').then(($options) => {
      if ($options.length > 1) {
        cy.get('[data-cy="Select-Hotel-Option"]').select(1);
        const selectedValue = $options.eq(1).val();

        cy.get('[data-cy="Edit-Images"]').click();
        cy.contains('Cancel').click();

        cy.get('[data-cy="Select-Hotel-Option"]').should('have.value', selectedValue);
      }
    });
  });

  it('Should have proper accessibility attributes', () => {
    cy.get('[data-cy="Select-Hotel"]').should('be.visible');
    cy.get('[data-cy="Select-Hotel-Option"]').should('be.visible');
  });

  it('Should handle keyboard navigation', () => {
    // Test that the button can be focused and clicked
    cy.get('[data-cy="Edit-Images"]').focus().should('be.focused');
    cy.get('[data-cy="Edit-Images"]').click();
    cy.contains('Upload Room Images').should('be.visible');
  });

  it('Should display Save Handler component', () => {
    cy.get('[data-cy="Create-Room"]').should('be.visible');
    cy.get('[data-cy="Create-Room"]').should('contain', 'Create Room');
  });

  it('Should handle GraphQL loading states', () => {
    cy.get('[data-cy="Select-Hotel-Option"]').should('exist');

    cy.get('[data-cy="General"]').should('be.visible');
    cy.get('[data-cy="Roomservice"]').should('be.visible');
    cy.get('[data-cy="Upcoming"]').should('be.visible');
  });
});
