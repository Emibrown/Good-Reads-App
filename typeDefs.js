import gql from "graphql-tag";

const typeDefs = gql`
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Query {
    getMe: UserResponse
    getBooks: BooksResponse
    getBook(id: String): BookResponse 
  }

  type User {
    id: ID
    firstName: String
    lastName: String
    email: String
    password: String
  }

  type Book {
    id: ID
    title: String
    coverImage: String
    bookCollection: String
    finished: Boolean
    rating: Int
    addedOn: String
    author: String
    user: ID
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

  type BooksResponse {
    status: String!
    books: [Book!]!
  }

  type BookResponse {
    status: String!
    book: Book!
  }

  type Mutation {
    createUser(firstName: String!, lastName: String!, email: String!, password: String!): UserResponse
    userLogin(email: String!, password: String!): TokenResponse
    createBook(file: Upload!, title: String, author: String): BookResponse
    updateBook(file: Upload, id: String, title: String, author: String, bookCollection: String): BookResponse
    onFinish(id: String, rating: String ): BookResponse
  }

  type Subscription {
    bookFeed: Book
  }
`;

export default typeDefs