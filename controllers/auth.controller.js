import { GraphQLError } from 'graphql';
import User from '../models/user.js';
import { signJwt } from '../utils/jwt.js';
import errorHandler from './error.controller.js';

async function signTokens(user) {
  // Create access token
  const access_token = signJwt({ user: user.id }, 'JWT_ACCESS');
  return { access_token };
}

const signup = async ( _, args ) => {
  try {
    const newUser = new User({
        firstName: args.firstName,
        lastName: args.lastName,
        email: args.email,
        password: args.password
    });
    const user = await newUser.save();

    return {
      status: 'success',
      user,
    };
  } catch (error) {
    if (error.code === 11000) {
      throw new GraphQLError("User already exist", {
        extensions: {
            code: 'BAD_USER_INPUT',
        },
      });
    }
    errorHandler(error);
  }
};

const login = async ( _, args, { res } ) => {
  try {
    const { email, password } = args;
    // Check if user exist and password is correct
    const user = await User
      .findOne({ email })
      .select('+password');

    if (!user || !(await user.comparePassword(password))) {
      throw new GraphQLError("Invalid email or password", {
        extensions: {
            code: 'GRAPHQL_VALIDATION_FAILED',
        },
      });
    }

    user.password = undefined;

    // Create a tokens
    const { access_token } = await signTokens(user);

    return {
      status: 'success',
      access_token,
      user,
    };
  } catch (error) {
    errorHandler(error);
  }
};

export default {
  signup,
  login,
};