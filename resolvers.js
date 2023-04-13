import authController from './controllers/auth.controller.js';
import userController from './controllers/user.controller.js';
import bookController from './controllers/book.controller.js';
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";

// GraphQL Resolvers
const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    getMe: userController.getMe,
    getBooks: bookController.getBooks,
    getBook: bookController.getBook
  },
  Mutation: {
    userLogin: authController.login,
    createUser: authController.signup,
    createBook: bookController.createBook,
    updateBook: bookController.updateBook,
  },
};

export default resolvers