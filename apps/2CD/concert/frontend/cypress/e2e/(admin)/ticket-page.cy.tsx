/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable max-lines */
describe('Create Concert E2E Tests', () => {
  const PAGE_URL = '/ticket';
  beforeEach(() => {
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'GetArtists') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              getArtists: [
                { id: '1', name: 'Artist One', genre: 'Rock' },
                { id: '2', name: 'Artist Two', genre: 'Pop' },
                { id: '3', name: 'Artist Three', genre: 'Jazz' },
              ],
            },
          },
        });
      }
    }).as('getArtists');
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'CreateConcert') {
        req.reply({
          statusCode: 200,
          body: {
            data: { createConcert: 'Success' },
          },
        });
      }
    }).as('createConcert');
    cy.visit(PAGE_URL);
    cy.get('[data-cy="Concert-Page"]', { timeout: 10000 }).should('be.visible');
  });
  it('should display the page correctly and show create concert button', () => {
    cy.get('[data-cy="Concert-Page"]').should('be.visible');
    cy.get('[data-cy="Concert-Title"]').should('contain.text', 'Тасалбар');
    cy.get('[data-cy="Concert-Subtitle"]').should('contain.text', 'Идвэхтэй зарагдаж буй тасалбарууд');
    cy.get('[data-testid="create-concert-modal-btn"]').should('be.visible').and('contain.text', 'Тасалбар Нэмэх');
  });
  it('should open create concert modal when button is clicked', () => {
    cy.get('[data-testid="create-concert-modal-btn"]', { timeout: 10000 }).should('be.visible').and('contain.text', 'Тасалбар Нэмэх').click();
    cy.get('[role="dialog"]').should('be.visible');
    cy.contains('Тасалбар нэмэх').should('be.visible');
  });
  it('should handle form validation errors', () => {
    cy.get('[data-testid="create-concert-modal-btn"]').click();
    cy.get('button[type="submit"]').click();
    cy.get('form').should('exist');
    cy.get('body').then(($body) => {
      if ($body.find('[role="alert"]').length > 0) {
        cy.get('[role="alert"]').should('exist');
      } else {
        cy.get('[role="dialog"]').should('be.visible');
      }
    });
  });
  it('should close modal when clicking outside or escape key', () => {
    cy.get('[data-testid="create-concert-modal-btn"]').click();
    cy.get('[role="dialog"]').should('be.visible');
    cy.get('body').type('{esc}');
    cy.get('[role="dialog"]').should('not.exist');
    cy.get('[data-testid="create-concert-modal-btn"]').click();
    cy.get('[role="dialog"]').should('be.visible');
    cy.get('body').type('{esc}');
    cy.get('[role="dialog"]').should('not.exist');
  });

  it('should reset end time when start time is selected to be later than or equal to end time', () => {
    cy.get('[data-testid="create-concert-modal-btn"]').click();
    cy.get('[data-cy="select-trigger-end"]').click();
    cy.get('[data-cy="select-end-hour-10:00"]').click();
    cy.get('[data-cy="select-value-endtime"]').should('contain.text', '10:00');
    cy.get('[data-cy="select-trigger-start"]').click();
    cy.get('[data-cy="select-start-hour-11:00"]').click();
    cy.get('[data-cy="select-value-starttime"]').should('contain.text', '11:00');
    cy.wait(200);
    cy.get('[data-cy="select-value-endtime"]', { timeout: 2000 }).should('not.contain.text', '10:00');
  });
  it('should select artist and remove it', () => {
    cy.get('[data-testid="create-concert-modal-btn"]').click();
    cy.get('[data-cy="select-trigger-artist"]')
      .click()
      .then(() => {
        cy.get('[data-testid="select-artist-1"]').click();
        cy.get('[data-cy="selected-artist-1"]').should('be.visible');
        cy.get('[data-cy="selected-artist-1"]').click();
        cy.get('[data-cy="selected-artist-1"]').should('not.exist');
      });
  });
  it('should if date some value required not add', () => {
    cy.get('[data-testid="create-concert-modal-btn"]').click();
    cy.get('[data-cy="select-trigger-start"]').click();
    cy.get('[data-cy="select-start-hour-08:00"]').click();
    cy.get('[data-testid="add-btn"]').click();
    cy.get('[data-testid="schedule-0"]').should('not.exist');
  });
  it('should add date and remove', () => {
    cy.get('[data-testid="create-concert-modal-btn"]').click();
    cy.get('[data-cy="select-trigger-start"]').click();
    cy.get('[data-cy="select-start-hour-08:00"]').click();
    cy.get('[data-cy="select-trigger-end"]').click();
    cy.get('[data-cy="select-end-hour-10:00"]').click();
    cy.get('[data-testid="add-btn"]').click();
    cy.get('[data-testid="schedules"]').should('be.visible');
    cy.get('[data-testid="schedule-0"]').should('be.visible');
    cy.get('[data-testid="delete-icon"]').should('be.visible');
    cy.get('[data-testid="delete-icon"]').eq(0).click();
    cy.get('[data-testid="schedule-0"]').should('not.exist');
  });
  it('should reset form when modal is reopened after successful submission', () => {
    const ticketTypes = ['VIP', 'STANDARD', 'BACKSEAT'];
    cy.intercept('POST', '**/createConcert').as('createConcert');
    cy.get('[data-testid="create-concert-modal-btn"]').click();
    cy.get('[data-cy="input-Тоглолтын нэр"]').type('First Concert');
    cy.get('[data-cy="input-Хөтөлбөрийн тухай"]').type('About');
    cy.get('[data-cy="thumbnailUrl-url"]').type('http://url');
    cy.get('[data-cy="select-trigger-artist"]').click();
    cy.get('[data-testid="select-artist-1"]').click();
    cy.get('[data-cy="select-trigger-start"]').click();
    cy.get('[data-cy="select-start-hour-08:00"]').click();
    cy.get('[data-cy="select-trigger-end"]').click();
    cy.get('[data-cy="select-end-hour-10:00"]').click();
    cy.get('[data-testid="add-btn"]').click();
    ticketTypes.forEach((type) => {
      cy.get(`[data-cy="input-${type} - Тоо ширхэг"]`).type('100');
      cy.get(`[data-cy="input-${type} - Үнэ"]`).type('1000');
    });
    cy.get('[data-cy="create-btn"]').click();
    cy.wait('@createConcert');
    cy.contains('Тасалбар амжилттай үүслээ');
    cy.get('[data-testid="create-concert-modal-btn"]').click();
    cy.get('input').first().should('have.value', '');
  });
  it('should show error message when creation fails', () => {
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'CreateConcert') {
        req.reply({
          statusCode: 200,
          body: {
            errors: [
              {
                message: 'Schedule already exists',
                locations: [{ line: 2, column: 3 }],
                path: ['createConcert'],
                extensions: { code: 'INTERNAL_SERVER_ERROR' },
              },
            ],
            data: null,
          },
        });
      }
    }).as('createConcertError');
    const ticketTypes = ['VIP', 'STANDARD', 'BACKSEAT'];
    cy.get('[data-testid="create-concert-modal-btn"]').click();
    cy.get('[data-cy="input-Тоглолтын нэр"]').type('First Concert');
    cy.get('[data-cy="input-Хөтөлбөрийн тухай"]').type('About');
    cy.get('[data-cy="thumbnailUrl-url"]').type('http://url');
    cy.get('[data-cy="select-trigger-artist"]').click();
    cy.get('[data-testid="select-artist-1"]').click();
    cy.get('[data-cy="open-calendar-form"]').click();
    cy.get('[data-testid="calendar"]').should('be.visible');
    cy.get('[data-cy="select-trigger-start"]').click();
    cy.get('[data-cy="select-start-hour-08:00"]').click();
    cy.get('[data-cy="select-trigger-end"]').click();
    cy.get('[data-cy="select-end-hour-10:00"]').click();
    cy.get('[data-testid="add-btn"]').click();
    ticketTypes.forEach((type) => {
      cy.get(`[data-cy="input-${type} - Тоо ширхэг"]`).type('100');
      cy.get(`[data-cy="input-${type} - Үнэ"]`).type('1000');
    });
    cy.get('[data-cy="create-btn"]').click();
    cy.wait('@createConcertError');
    cy.contains('Schedule already exists');
  });
});
