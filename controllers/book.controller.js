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

const getFinishedBooks = async (_, __, { req, getAuthUser }) => {
  try {
    await checkIsLoggedIn(req, getAuthUser);
    
    await getAuthUser(req);

    const books = await Book.find({finished: true}).sort({updatedAt: -1});

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
    newBook.coverImage = `${req.protocol}://${req.get('host')}/public/${fileNewName}.${fileExt}`;

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

const updateBook = async (_, { file, ...args }, { req, getAuthUser }) => {
  try {
    await checkIsLoggedIn(req, getAuthUser);

    const owner = await getAuthUser(req);

    const { id, ...updatedBook } = args;

    const {user} = await Book.findById(id)

    if (user != owner.id){
      throw new GraphQLError("You are not the Owner", {
        extensions: {
          code: 'GRAPHQL_VALIDATION_FAILED',
        },
      });
    }

    if(file){
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
      

      const fileNewName = `${args.title.split(' ').join('-')}-${updatedBook._id}`;
      updatedBook.coverImage = `${req.protocol}://${req.get('host')}/public/${fileNewName}.${fileExt}`;
  
      // file upload
      const stream = createReadStream();
      const out = fs.createWriteStream(`upload/${fileNewName}.${fileExt}`);
      stream.pipe(out);
    }

    const book = await Book.findByIdAndUpdate(id, updatedBook);

    return {
      status: 'success',
      book,
    };
  } catch (error) {
    errorHandler(error);
  }
};

const onFinish = async (args, pubSub, { req, getAuthUser }) => {
  try {
    await checkIsLoggedIn(req, getAuthUser);

    const owner = await getAuthUser(req);

    const { id, ...updatedBook } = args;

    const {user} = await Book.findById(id)

    if (user != owner.id){
      throw new GraphQLError("You are not the Owner", {
        extensions: {
          code: 'GRAPHQL_VALIDATION_FAILED',
        },
      });
    }

    updatedBook.finished = true;

    const book = await Book.findByIdAndUpdate(id, updatedBook, {new: true});

    pubSub.publish('BOOK_FINISHED', { bookFeed: book})

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
  createBook,
  updateBook,
  onFinish,
  getFinishedBooks
};