import User from "./models/user.js";
import authController from './controllers/auth.controller.js';
import userController from './controllers/user.controller.js';

// GraphQL Resolvers
const resolvers = {
  Query: {
    getMe: userController.getMe,
  },
  Mutation: {
    userLogin: authController.login,
    createUser: authController.signup,
  },
};

export default resolvers