import gql from 'graphql-tag';

const FoodTypeDef = gql`
  type Food {
    _id: ID!
    name: String!
    price: Float!
    description: String
    image: String
    category: String
  }

  type Mutation {
    createFood(name: String!, price: Float!, description: String, image: String, category: String): Food!
    deleteFood(_id: ID!): Food!
    updateFood(_id: ID!, name: String, price: Float, description: String, image: String, category: String): Food!
  }

  type Query {
    getAllFood: [Food!]!
    deleteFood(_id: ID!): Food!
  }
`;
export default FoodTypeDef;
