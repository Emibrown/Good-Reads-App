import gql from "graphql-tag";

const typeDefs = gql`
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Query {
    hello(name: String): String!
    getMe: UserResponse
    getBooks: BooksResponse
    getBook(id: String): BookResponse
    getFinishedBooks: BooksResponse
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
    updatedAt: String
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

  type DeleteResponse {
    status: String!
  }

  type Mutation {
    createUser(firstName: String!, lastName: String!, email: String!, password: String!): UserResponse
    userLogin(email: String!, password: String!): TokenResponse
    createBook(file: Upload!, title: String, author: String): BookResponse
    updateBook(file: Upload, id: String, title: String, author: String, bookCollection: String): BookResponse
    onFinish(id: String, rating: String ): BookResponse
    deleteBook(id: String): BookResponse
  }

  type Subscription {
    bookFeed: Book
  }
`;

export default typeDefs