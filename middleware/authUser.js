import { GraphQLError } from 'graphql';
import errorHandler from '../controllers/error.controller.js';
import User from '../models/user.js';
import { verifyJwt } from '../utils/jwt.js';

const authUser = async (req) => {
  try {
    // Get the access token
    let access_token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      access_token = req.headers.authorization.split(' ')[1];
    } 

    if (!access_token) return false;

    // Validate the Access token
    const decoded = verifyJwt(access_token, 'JWT_ACCESS');

    if (!decoded) return false;

    // Check if user exist
    const user = await User
      .findById(decoded.user)

    if (!user) {
      throw new GraphQLError("The user belonging to this token no logger exist", {
        extensions: {
            code: 'BAD_USER_INPUT',
        },
      });
    }

    return user;
  } catch (error) {
    errorHandler(error);
  }
};

export default authUser;