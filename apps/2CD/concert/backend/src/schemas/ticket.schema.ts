import gql from 'graphql-tag';

export const ticketDef = gql`
  type Ticket {
    id: ID!
    price: Int!
    type: ticketType!
    concert: Concert!
    quantity: Int!
    createdAt: Date!
    updatedAt: Date!
  }
  enum ticketType {
    VIP
    STANDARD
    BACKSEAT
  }
  input CreateTicketInput {
    price: Int!
    quantity: Int!
    type: ticketType
  }
`;
