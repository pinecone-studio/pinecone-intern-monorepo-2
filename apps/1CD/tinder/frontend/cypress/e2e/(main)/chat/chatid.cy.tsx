describe('Chat page should be visible', () => {
  it('1. When clicking on a matched user with no previous chat, it should push the ID of the selected user to the URL', () => {
    cy.intercept('POST', 'api/graphql', (req) => {
      if (req.body.operationName === 'GetMatchedUsers') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              getMatch: [
                {
                  _id: '6746baabd05c7f4092dad320',
                  name: 'Sarah',
                  profession: 'Software engineer',
                  photos: [
                    "",
                    "",
                    ""
                  ],
                  age: 29,
                  hasChatted: false,
                  __typename: 'MatchedUser',
                },
                {
                  _id: '6747b8ca2620b89f89ae1b54',
                  name: 'Anna',
                  profession: 'Artist',
                  photos: [
                    "",
                    "",
                    ""
                  ],
                  age: 25,
                  hasChatted: true,
                  __typename: 'MatchedUser',
                }
              ]
            }
          }
        });
      }
    }).as('GetMatchedUsers');  
    
    cy.visit('/chat');
    cy.wait('@GetMatchedUsers').then((intercept) => {
      
      
      if (intercept?.response?.body) {
      const matchedData = intercept?.response?.body?.data?.getMatch;
      expect(matchedData).to.have.length(2);
      expect(matchedData[0].name).to.equal('Sarah');
      expect(matchedData[0].profession).to.equal('Software engineer');
      expect(matchedData[1].name).to.equal('Anna');
      expect(matchedData[1].profession).to.equal('Artist');
      cy.get(`[data-cy="Matched-Users-${matchedData[0]._id}"]`).click();
      cy.url().should('include', `/chat/${matchedData[0]._id}`);
      if (matchedData){
        cy.get('[data-cy="Chat-Matches-Part"]').should('be.visible')
        cy.get('[data-cy="Chat-Sidebar-Page"]').should('be.visible');
      }
      cy.get('[data-cy="Chat-Part-Page"]')
        .contains('You’ve got a match! Send a message to start chatting')
        .should('be.visible');
      cy.get('[data-cy="Chat-Part-Message-Input"]').type('Hi, how are you');
      cy.intercept('POST', 'api/graphql', (req) => {
        if (req.body.operationName === 'CreateChat') {
          req.reply({
            statusCode: 200,
            body: {
              data: {
                createChat: {
                  content: 'Hi, how are you',
                  senderId: '675675e84bd85fce3de34006',
                  __typename: 'TinderChatresponse'
                }
              }
            }
          });
        }
      }).as('CreateChat');
      cy.get('[data-cy="Chat-Part-Message-Input"]').type('{enter}');
      cy.wait('@CreateChat').then((intercept) => {
        const createChatResponse = intercept?.response?.body;
        assert.isNotNull(createChatResponse, 'Successfully created chat');
      });
      cy.get('[data-cy="Chat-Part-Message-Input"]').should('have.value', '');
      cy.intercept('POST', 'api/graphql', (req) => {
        if (req.body.operationName === 'GetChatbyId') {
          req.reply({
            statusCode: 200,
            body: {
              data: {
                getChat: [
                  {
                    _id: '676cd1efafac8576c5b6babf',
                    content: 'Hi, how are you',
                    senderId: '675675e84bd85fce3de34006',
                    createdAt: '2024-12-26T03:47:59.081Z',
                    chatId: '676cd1eeafac8576c5b6babd',
                    __typename: 'TinderChatresponse'
                  }
                ]
              }
            }
          });
        }
      }).as('GetChatbyId');
      cy.wait('@GetChatbyId').then((intercept) => {
        const chatResponse = intercept?.response?.body;
        assert.isNotNull(chatResponse, 'Successfully fetched chat');
      });
      cy.get('[data-cy="Chat-Part-Page"]').should('have.text', 'Thu 12/26/2024Hi, how are youSent: 11:47');
    } else {
      throw new Error('Response is undefined or malformed');
    }
    });
  }); 
  it('2. When there are no match, it should render No Matches Yet text', () => {
    cy.intercept('POST', 'api/graphql', (req) => {
      if (req.body.operationName === 'GetMatchedUsers') {
        req.reply({
          statusCode: 200,
          body: {
            errors: [{ message: 'Error occurred: No matches found' }],
          },
        });
      }
    }).as('GetMatchedUsers');
    cy.visit('/chat');
    cy.wait('@GetMatchedUsers').then((intercept) => {
      assert.isNotNull(intercept?.response?.body, 'Error occurred: No matches found');
    });
    cy.get('[data-cy="No-Matches-Found"]').should('be.visible');
    cy.get('[data-cy="No-Matches-Found"] p').first().should('contain.text', 'No Matches Yet');
    cy.get('[data-cy="No-Matches-Found"] p').last().should('contain.text', 'Keep swiping, your next match could be just around the corner!');
  });
  it('3. When there is error other than no match, it should display Error occurred, try again text', () => {
    cy.intercept('POST', 'api/graphql', (req) => {
      if (req.body.operationName === 'GetMatchedUsers') {
        req.reply({
          statusCode: 200,
          body: {
            errors: [{ message: 'Error occurred: Internal Server error' }],
          },
        });
      }
    }).as('GetMatchedUsers');
    cy.visit('/chat');
    cy.wait('@GetMatchedUsers').then((intercept) => {
      assert.isNotNull(intercept?.response?.body, 'Error occurred: Internal Server error');
    });
    cy.get('[data-cy="Error occured"]').should('be.visible');
    cy.get('[data-cy="Error occured"] p').should('contain.text', 'Error occurred, try again');
  });
});
