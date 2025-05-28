import gql from 'graphql-tag';

const FoodTypeDef = gql`


type Food {
  name: String!
  price: Float!
  description: String
  image: String
}


  type Mutation {
createFood(name: String!, price: Float!, description: String, image: String): Food!
  }
`;
export default FoodTypeDef;
