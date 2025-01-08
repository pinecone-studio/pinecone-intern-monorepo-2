import { interceptGraphql } from 'cypress/utils/intercept-graphql';
describe('CreateEventModal Component', () => {
  beforeEach(() => {
    const mockToken = {
      token: 'faketoken',
    };
    cy.window().then((window) => {
      window.localStorage.setItem('token', JSON.stringify(mockToken));
    });
    interceptGraphql({
      state: '',
      operationName: 'GetMe',
      data: {
        data: {
          getMe: {
            email: 'example@gmail.com',
            role: 'admin',
            phoneNumber: '+976 95160812',
            __typename: 'User',
          },
        },
      },
    });
    cy.visit('/admin/home');
    cy.get('[data-testid="create-event-button"]').click();
  });
  it('should give error when form submission fails', () => {
    interceptGraphql({ state: 'error', operationName: 'CreateEvent' });
    cy.get('[data-testid="event-name-input"]').type('Test Event').should('have.value', 'Test Event');
    cy.get('[data-testid="event-description-input"]').type('This is a test event description').should('have.value', 'This is a test event description');
    // Upload image
    const imagePath = 'mock-image.png';
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
        cy.get('[data-testid="image-upload-loading"]').should('be.visible');
        cy.get('[data-testid="image-preview"]').should('be.visible');
      });
    });
    cy.get('[data-testid="venue-select"]').click();
    cy.get('[data-testid="arena-item-1"]').click();
    // Select category
    cy.get('[data-testid="category-button"]').click();
    cy.get('[data-testid="category-item-0"]').click();
    // Simulate selecting a date
    cy.get('[data-testid="date-picker-button"]').click();
    cy.get('[data-testid="date-picker-calendar"]').find('[role="gridcell"]').contains('1').should('be.visible').click();
    cy.get('[data-testid="date-picker-calendar"]').find('[role="gridcell"]').contains('10').should('be.visible').click();
    cy.get('[data-testid="date-picker-button"]').click();
    // Fill in ticket zone data
    cy.get('[data-testid="ticket-type-0"] [data-testid="unit-price-input-0"]').type('1000').should('have.value', '1000');
    cy.get('[data-testid="ticket-type-0"] [data-testid="total-quantity-input-0"]').type('50').should('have.value', '50');
    cy.get('[data-testid="ticket-type-1"] [data-testid="unit-price-input-1"]').type('1000').should('have.value', '1000');
    cy.get('[data-testid="ticket-type-1"] [data-testid="total-quantity-input-1"]').type('50').should('have.value', '50');
    cy.get('[data-testid="ticket-type-2"] [data-testid="unit-price-input-2"]').type('1000').should('have.value', '1000');
    cy.get('[data-testid="ticket-type-2"] [data-testid="total-quantity-input-2"]').type('50').should('have.value', '50');
    // Select time
    cy.get('[data-testid="hour-select"]').click();
    cy.get('[data-testid="hour-select-item-02"]').click();
    cy.get('[data-testid="minute-select"]').click();
    cy.get('[data-testid="minute-select-item-20"]').click();
    cy.get('[data-testid="hour-select"]').should('contain.text', '02');
    cy.get('[data-testid="minute-select"]').should('contain.text', '20');
    cy.get('[data-testid="main-artist-name-input-0"]').type('Main Artist 1');
    cy.get('[data-testid="submit-button"]').click();
    cy.get('.toast').should('contain.text', 'An error occurred');
  });
  it('should render all form fields correctly', () => {
    cy.get('[data-testid="event-name-input"]').should('exist').and('have.attr', 'placeholder', 'Нэр оруулах');
    cy.get('[data-testid="event-description-input"]').should('exist').and('have.attr', 'placeholder', 'Дэлгэрэнгүй мэдээлэл');
    cy.get('[data-testid="form-label-date"]').should('exist');
    cy.get('[data-testid="time-picker"]').should('exist');
    cy.get('[data-testid="ticket-type-fields"]').should('exist');
    cy.get('[data-testid="submit-button"]').should('exist').and('contain.text', 'Үүсгэх');
  });
  it('should allow the user to fill in the form and submit', () => {
    // Fill in the event name
    cy.get('[data-testid="event-name-input"]').type('Test Event').should('have.value', 'Test Event');
    // Fill in the event description
    cy.get('[data-testid="event-description-input"]').type('This is a test event description').should('have.value', 'This is a test event description');
    //image
    const imagePath = 'mock-image.png';
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
        cy.get('[data-testid="image-upload-loading"]').should('be.visible');
        cy.get('[data-testid="image-preview"]').should('be.visible');
      });
    });
    //arena
    cy.get('[data-testid="venue-select"]').click();
    cy.get('[data-testid="arena-item-1"]').click();
    // category
    cy.get('[data-testid="category-button"]').click();
    cy.get('[data-testid="category-item-0"]').click();
    // Simulate selecting a date
    cy.get('[data-testid="date-picker-button"]').click();
    cy.get('[data-testid="date-picker-calendar"]').find('[role="gridcell"]').contains('1').should('be.visible').click();
    cy.get('[data-testid="date-picker-calendar"]').find('[role="gridcell"]').contains('10').should('be.visible').click();
    cy.get('[data-testid="date-picker-button"]').click();

    // Fill in the ticket zone
    //VIP
    cy.get('[data-testid="ticket-type-0"] [data-testid="discount-input-0"]').type('10').should('have.value', '10');
    cy.get('[data-testid="ticket-type-0"] [data-testid="unit-price-input-0"]').type('1000').should('have.value', '1000');
    cy.get('[data-testid="ticket-type-0"] [data-testid="total-quantity-input-0"]').type('50').should('have.value', '50');
    //Backstage
    cy.get('[data-testid="ticket-type-1"] [data-testid="discount-input-1"]').type('10').should('have.value', '10');
    cy.get('[data-testid="ticket-type-1"] [data-testid="unit-price-input-1"]').type('1000').should('have.value', '1000');
    cy.get('[data-testid="ticket-type-1"] [data-testid="total-quantity-input-1"]').type('50').should('have.value', '50');
    //Regular
    cy.get('[data-testid="ticket-type-2"] [data-testid="discount-input-2"]').type('10').should('have.value', '10');
    cy.get('[data-testid="ticket-type-2"] [data-testid="unit-price-input-2"]').type('1000').should('have.value', '1000');
    cy.get('[data-testid="ticket-type-2"] [data-testid="total-quantity-input-2"]').type('50').should('have.value', '50');
    // Simulate selecting a time
    cy.get('[data-testid="hour-select"]').click();
    cy.get('[data-testid="hour-select-item-02"]').click();
    cy.get('[data-testid="minute-select"]').click();
    cy.get('[data-testid="minute-select-item-20"]').click();
    cy.get('[data-testid="hour-select"]').should('contain.text', '02');
    cy.get('[data-testid="minute-select"]').should('contain.text', '20');
    //artist
    cy.get('[data-testid="main-artist-name-input-0"]').type('Main Artist 1');
    cy.get('[data-testid="guest-artist-name-input-0"]').type('Guest Artist 1');
    // Submit the form
    cy.get('[data-testid="submit-button"]').click();
    cy.get('.toast').should('contain.text', 'Successfully created');
    cy.request({
      method: 'POST',
      url: 'https://concert-ticket-booking-backend.vercel.app/api/graphql',
      body: {
        query: `
          mutation {
            deleteLastEvent {
              message
            }
          }
        `,
      },
    }).then((deleteResponse) => {
      console.log('Intercepted request:', deleteResponse);
      expect(deleteResponse.body.data.deleteLastEvent.message).to.equal('Event successfully deleted');
    });
  });
});
