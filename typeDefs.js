import gql from "graphql-tag";

const typeDefs = gql`

  type Query {
    user(id: ID): User #return user by id
  }

  type User {
    id: ID
    firstName: String
    lastName: String
    email: String
    password: String
  }

  type TokenResponse {
    status: String!
    access_token: String!
    user: User!
  }

  type UserResponse {
    status: String!
    user: User!
  }

  type Mutation {
    createUser(firstName: String, lastName: String, email: String, password: String): UserResponse
    userLogin(email: String, password: String): TokenResponse
  }
`;

export default typeDefs