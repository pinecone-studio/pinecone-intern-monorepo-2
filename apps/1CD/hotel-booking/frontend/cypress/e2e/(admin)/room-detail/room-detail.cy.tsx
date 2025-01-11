describe('Room detail page in admin folder', () => {
  const mockRoomDetail = {
    getRoom: {
      roomName: 'Economy Single Room',
      roomType: 'Single',
      price: 1200,
      roomInformation: ['Air conditioning', 'Free WIFI', 'Room service'],
      roomService: {
        bathroom: ['eee', 'eee', 'aaa'],
        accessability: ['rrr', 'ddd', 'eedd'],
        entertaiment: ['eee', 'eee', 'aaa'],
        foodDrink: ['rrr', 'ddd', 'eedd'],
      },
    },
  };

  beforeEach(() => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetRoom') {
        req.reply({ data: mockRoomDetail });
      }
    }).as('getRoom');

    cy.visit('/room-detail/67734f9cc1bc07a554f731a0');
  });

  it('1.Should render room-detail', () => {
    cy.get('[data-cy=Room-Detail-Page]').should('exist').and('be.visible');
  });

  it('2.GeneralInfo Dialog should be visible when edit button is clicked', () => {
    cy.get('[data-cy=General-Info-Dialog-Button]').should('exist').click();
    cy.get('[data-cy=General-Info-Fields-Dialog]').should('exist');
    cy.get('[data-cy=General-Info-Cancel-Button]').should('exist').click();
    cy.get('[data-cy=General-Info-Fields-Dialog]').should('not.be.visible');
  });

  it('3.GeneralInfo Dialog should be editable', () => {
    cy.get('[data-cy=General-Info-Dialog-Button]').should('exist').click();
    cy.get('[data-cy=General-Info-Fields-Dialog]').should('exist');
    cy.get('[data-cy=Room-Name-Input]').type(mockRoomDetail.getRoom.roomName).clear().type('Standard room');
    cy.get('[data-cy=Room-Type-Input]').type(mockRoomDetail.getRoom.roomType).clear().type('Luxury');
    cy.get('[data-cy=Room-Price-Input]').type(mockRoomDetail.getRoom.price.toString()).clear().type('300');

    cy.get('input[placeholder="Select options..."]').clear().type('show');
    cy.get('input[placeholder="Select options..."]').trigger('keydown', { key: 'Enter', keyCode: 13, code: 'Enter' });
    cy.get('[data-cy=General-Info-Save-Button]').should('exist').click({ force: true });
    cy.get('[data-cy=General-Info-Fields-Dialog]').should('not.be.visible');
    cy.get('[data-cy=General-Info-Cancel-Button]').should('exist').click();
    cy.get('[data-cy=General-Info-Fields-Dialog]').should('not.be.visible');
  });

  it('4.RoomServices-Dialog should be visible when edit button is clicked', () => {
    cy.get('[data-cy=Room-Service-Dialog-Button]').should('exist').click();
    cy.get('[data-cy=Room-Services-Dialog]').should('exist');
    cy.get('[data-cy=Room-Services-Cancel-Button]').click();
    cy.get('[data-cy=Room-Services-Dialog]').should('not.be.visible');
  });

  // it('5.ImagesDialog should be visible when edit button is clicked', () => {
  //   cy.get('[data-cy=Images-Dialog-Button]').should('exist').click();
  //   cy.get('[data-cy=Images-Dialog]').should('exist');
  //   cy.get('[data-cy=Images-Cancel-Button]').should('exist').click();
  //   cy.get('[data-cy=Images-Dialog]').should('not.be.visible');
  // });
});
