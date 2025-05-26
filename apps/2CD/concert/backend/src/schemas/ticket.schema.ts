import gql from 'graphql-tag';

export const ticketDef = gql`
  type Ticket {
    id: ID!
    price: Int!
    type: ticketType!
    quantity: Int!
    createdAt: Date!
    updatedAt: Date!
  }
  enum ticketType {
    VIP
    STANDARD
    BACKSEAT
  }
  enum ticketStatus {
    AVAILABLE
    RESERVED
    SOLD
  }
`;
