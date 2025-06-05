import gql from 'graphql-tag';

export const scheduleDef = gql`
  type Schedule {
    id: ID!
    endDate: Date!
    startDate: Date!
    concert: Concert!
    venue: String!
    createdAt: Date!
    updatedAt: Date!
  }

  input ScheduleInput {
    endDate: Date!
    startDate: Date!
  }
`;
