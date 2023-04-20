import authController from './controllers/auth.controller.js';
import userController from './controllers/user.controller.js';
import bookController from './controllers/book.controller.js';
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import { PubSub } from "graphql-subscriptions";

const pubSub = new PubSub();

// GraphQL Resolvers
const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    hello: (_, { name }) => `Hello ${name}!`,
    getMe: userController.getMe,
    getBooks: bookController.getBooks,
    getBook: bookController.getBook,
    getFinishedBooks: bookController.getFinishedBooks
  },
  Mutation: {
    userLogin: authController.login,
    createUser: authController.signup,
    createBook: bookController.createBook,
    updateBook: bookController.updateBook,
    onFinish: async (_, args, context) => bookController.onFinish(args, pubSub, context),
    deleteBook: bookController.deleteBook,
  },
  Subscription: {
    bookFeed: {
        subscribe: () => pubSub.asyncIterator(['BOOK_FINISHED'])
    }
  }
};

export default resolvers