import errorHandler from '../controllers/error.controller.js';
import { GraphQLError } from 'graphql';

const checkIsLoggedIn = async (req, getAuthUser) => {
  try {
    // Check if user is logged in
    const authUser = await getAuthUser(req);

    if (!authUser) {
      throw new GraphQLError("You are not logged in", {
        extensions: {
            code: 'BAD_USER_INPUT',
        },
      });
    }
  } catch (error) {
    errorHandler(error);
  }
};

export default checkIsLoggedIn;