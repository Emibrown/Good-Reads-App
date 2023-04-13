import errorHandler from './error.controller.js';
import checkIsLoggedIn from '../middleware/checkIsLoggedIn.js';
import { GraphQLError } from 'graphql';
import Book from '../models/book.js';
import fs from 'fs';

const getBooks = async (_, __, { req, getAuthUser }) => {
  try {
    await checkIsLoggedIn(req, getAuthUser);

    const user = await getAuthUser(req);

    const books = await Book.find({user: user._id})

    return {
      status: 'success',
      books,
    };
  } catch (error) {
    errorHandler(error);
  }
};

const getBook = async (_, args, { req, getAuthUser }) => {
  try {
    await checkIsLoggedIn(req, getAuthUser);

    const user = await getAuthUser(req);

    const { id } = args;

    const book = await Book.findById(id)

    if (book.user != user.id){
      return
    }

    return {
      status: 'success',
      book,
    };
  } catch (error) {
    errorHandler(error);
  }
};

const createBook = async (_, { file, ...args }, { req, getAuthUser }) => {
  try {
    await checkIsLoggedIn(req, getAuthUser);
    const user = await getAuthUser(req);
    const { createReadStream, filename, mimetype, encoding } = await file;

    const fileExt = filename.split('.').pop();

    const isExt = ["jpg","jpeg","png"].includes(fileExt)

    if(!isExt) { 
      throw new GraphQLError("Image uploaded is not of type jpg, jpeg or png", {
        extensions: {
          code: 'GRAPHQL_VALIDATION_FAILED',
        },
      });
    }
    
    const newBook = new Book({
      title: args.title,
      author: args.author,
      user: user._id
    });

    const fileNewName = `${args.title.split(' ').join('-')}-${newBook._id}`;

    newBook.coverImage = `${process.env.FILE_ROOT_URL}/${fileNewName}.${fileExt}`;

    const book = await newBook.save();

    // file upload
    const stream = createReadStream();
    const out = fs.createWriteStream(`upload/${fileNewName}.${fileExt}`);
    stream.pipe(out);

    return {
      status: 'success',
      book,
    };
  } catch (error) {
    errorHandler(error);
  }
};

export default {
  getBooks,
  getBook,
  createBook
};