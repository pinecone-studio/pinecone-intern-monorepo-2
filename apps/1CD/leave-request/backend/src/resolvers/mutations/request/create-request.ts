import { MutationResolvers } from 'src/generated';

export const createsRequest: MutationResolvers['createsRequest'] = async (_, { requestType, requestDate, message, supervisorEmail }, context) => {
  

    const headers = context.req.headers

  console.log(typeof headers.Headers, headers)
};
