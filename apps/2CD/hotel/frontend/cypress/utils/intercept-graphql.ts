type InterceptGraphqlType = {
  state: string;
  operationName: string;
  data?: unknown;
};

const generateResponse = (state: string) => {
  switch (state) {
    case 'loading':
      return { data: null, loading: true, error: null };
    case 'error':
      return { loading: false, error: true };
    default:
      return {};
  }
};

export const interceptGraphql = (props: InterceptGraphqlType) => {
  const { state, operationName, data } = props;
  const response = generateResponse(state);

  cy.intercept('POST', '**/graphql', (req) => {
    if (req.body.operationName === operationName) {
      console.log('This is operation name', req.body.operationName);

      req.reply({
        statusCode: 200,
        body: data || response,
      });
    }
  }).as(operationName);
};
