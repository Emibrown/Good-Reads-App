import User from "./models/user.js";
import authController from './controllers/auth.controller.js';

// GraphQL Resolvers
const resolvers = {
  Query: {
    user: async (parent, args) => await User.findById(args.id),
  },
  Mutation: {
    userLogin: authController.login,
    createUser: authController.signup,
  },
};

export default resolvers