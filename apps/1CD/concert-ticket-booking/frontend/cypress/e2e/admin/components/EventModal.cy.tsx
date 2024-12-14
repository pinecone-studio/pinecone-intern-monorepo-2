describe('CreateEventModal Component', () => {
  beforeEach(() => {
    cy.intercept('POST', `https://api.cloudinary.com/v1_1/${Cypress.env('NEXT_PUBLIC_CLOUD_NAME')}/image/upload`, {
      statusCode: 200,
      body: {
        secureUrl: 'https://example.com/test-image.jpg',
      },
    }).as('imageUpload');
    cy.visit('/admin/home');
  });

  it('should open modal when "Тасалбар нэмэх" button is clicked', () => {
    // Verify the modal is initially hidden
    cy.get('[data-testid="modal-title"]').should('not.exist');

    // Click the "Тасалбар нэмэх" button
    cy.get('[data-testid="create-event-button"]').click();

    // Verify the modal is open by checking the title
    cy.get('[data-testid="modal-title"]').should('be.visible').and('contain.text', 'Тасалбар нэмэх');

    // Check that the modal has the close button
    cy.get('[data-testid="close-modal-button"]').should('be.visible');
  });

  it('should close the modal when the close button is clicked', () => {
    // Open the modal
    cy.get('[data-testid="create-event-button"]').click();

    // Click the close button
    cy.get('[data-testid="close-modal-button"]').click();

    // Verify that the modal is closed
    cy.get('[data-testid="modal-title"]').should('not.exist');
  });

  it('should render all form fields correctly', () => {
    // Open the modal
    cy.get('[data-testid="create-event-button"]').click();

    // Check if the event name input is rendered
    cy.get('[data-testid="event-name-input"]').should('exist').and('have.attr', 'placeholder', 'Нэр оруулах');

    // Check if the event description input is rendered
    cy.get('[data-testid="event-description-input"]').should('exist').and('have.attr', 'placeholder', 'Дэлгэрэнгүй мэдээлэл');

    // Check if date picker is rendered
    cy.get('[data-testid="form-label-date"]').should('exist'); // Adjust this to the correct selector

    // Check if time picker is rendered
    cy.get('[data-testid="time-picker"]').should('exist'); // Adjust this to the correct selector

    // Check if the ticket input form is rendered
    cy.get('[data-testid="ticket-type-fields"]').should('exist');

    // Check if the submit button is rendered
    cy.get('[data-testid="submit-button"]').should('exist').and('contain.text', 'Үүсгэх');
  });

  it('should allow the user to fill in the form and submit', () => {
    // Open the modal
    cy.get('[data-testid="create-event-button"]').click();

    // Fill in the event name
    cy.get('[data-testid="event-name-input"]').type('Test Event').should('have.value', 'Test Event');

    // Fill in the event description
    cy.get('[data-testid="event-description-input"]').type('This is a test event description').should('have.value', 'This is a test event description');

    //image

    const imagePath = '../../public/images/logo.png';

    cy.get('[data-testid="image-upload-button"]').click();
    cy.fixture(imagePath, 'base64').then((fileContent) => {
      const blob = Cypress.Blob.base64StringToBlob(fileContent, 'image/jpeg');
      const file = new File([blob], 'test-image.jpg', { type: 'image/jpeg' });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      cy.get('[data-testid="file-input"]').then(($input) => {
        const input = $input[0] as HTMLInputElement;
        input.files = dataTransfer.files;

        cy.wrap($input).trigger('change', { force: true });
      });
    });
    cy.get('[data-testid="image-upload-loading"]').should('be.visible');
    cy.get('[data-testid="image-preview"]').should('be.visible');

    // Fill in the ticket zone
    cy.get('[data-testid="ticket-type-0"] [data-testid="discount-input-0"]').type('10%').should('have.value', '10%');
    cy.get('[data-testid="ticket-type-0"] [data-testid="unit-price-input-0"]').type('1000').should('have.value', '1000');
    cy.get('[data-testid="ticket-type-0"] [data-testid="total-quantity-input-0"]').type('50').should('have.value', '50');

    cy.get('[data-testid="ticket-type-1"] [data-testid="discount-input-1"]').type('10%').should('have.value', '10%');
    cy.get('[data-testid="ticket-type-1"] [data-testid="unit-price-input-1"]').type('1000').should('have.value', '1000');
    cy.get('[data-testid="ticket-type-1"] [data-testid="total-quantity-input-1"]').type('50').should('have.value', '50');

    cy.get('[data-testid="ticket-type-2"] [data-testid="discount-input-2"]').type('10%').should('have.value', '10%');
    cy.get('[data-testid="ticket-type-2"] [data-testid="unit-price-input-2"]').type('1000').should('have.value', '1000');
    cy.get('[data-testid="ticket-type-2"] [data-testid="total-quantity-input-2"]').type('50').should('have.value', '50');

    // Simulate selecting a date
    cy.get('[data-testid="date-picker-button"]').click();
    cy.get('[data-testid="date-picker-calendar"]').find('[role="gridcell"]').contains('1').should('be.visible').click();
    cy.get('[data-testid="date-picker-calendar"]').find('[role="gridcell"]').contains('10').should('be.visible').click();
    cy.get('[data-testid="date-picker-button"]').click();
    cy.get('[data-testid="date-picker-button"]').should('contain', 'Dec 01, 2024 - Dec 10, 2024'); // Adjust this to your actual selector and format

    // Simulate selecting a time
    cy.get('[data-testid="hour-select"]').click();
    cy.get('[data-testid="hour-select-item-02"]').click();
    cy.get('[data-testid="minute-select"]').click();
    cy.get('[data-testid="minute-select-item-20"]').click();
    cy.get('[data-testid="hour-select"]').should('contain.text', '02');
    cy.get('[data-testid="minute-select"]').should('contain.text', '20'); // Adjust this to your actual selector and format
    //artist
    cy.get('[data-testid="main-artist-name-input-0"]').type('Main Artist 1');
    cy.get('[data-testid="guest-artist-name-input-0"]').type('Guest Artist 1');
    //arena
    cy.get('[data-testid="venue-select"]').click();
    cy.get('[data-testid="arena-item-1"]').click();
    // category
    cy.get('[data-testid="category-button"]').click();
    cy.get('[data-testid="category-item-0"]').click();
    // Submit the form
    cy.get('[data-testid="submit-button"]').click();
  });
});
