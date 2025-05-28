import gql from 'graphql-tag';

const FoodTypeDef = gql`


type Food {
  _id: ID!
  name: String!
  price: Float!
  description: String
  image: String
}


  type Mutation {
createFood(name: String!, price: Float!, description: String, image: String): Food!
  }
  type Query {
    getAllFood: [Food!]!
  }

`;
export default FoodTypeDef;
