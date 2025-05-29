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
  getAllCategories: [Category!]!
}

`;
export default CategoryTypeDef;
