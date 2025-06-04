import gql from "graphql-tag";

const CategoryTypeDef = gql`

type Category {
  _id: ID!
  name: String!
}
type Mutation {
  createCategory(name: String!): Category!
}
type Query {
  getAllCategory: [Category!]!
  getFoodCategory(_id: ID!): [Food!]!
}

`;
export default CategoryTypeDef;
