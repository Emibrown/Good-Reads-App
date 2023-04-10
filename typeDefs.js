import gql from "graphql-tag";

const typeDefs = gql`
  type Query {
    hello: String
    welcome(name: String): String
  }
`;

export default typeDefs