import jwt from 'jsonwebtoken';
import errorHandler from '../controllers/error.controller.js';

export const signJwt = (payload, Key) => {
  const privateKey = process.env[Key];
  return jwt.sign(payload, privateKey);
};

export const verifyJwt = (token, Key) => {
  try {
    const privateKey = process.env[Key];
    const decoded = jwt.verify(token, privateKey);
    return decoded;
  } catch (error) {
    errorHandler(error);
  }
};