import gql from "graphql-tag";
import { ApolloServer } from "@apollo/server";
import resolvers from "../resolvers.js";
import typeDefs from "../typeDefs.js";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import validateEnv from '../utils/validateEnv.js';
import Upload  from "graphql-upload/Upload.mjs";
import fs from 'fs';
import path from "path";
import getAuthUser from '../middleware/authUser.js';
import bookController from "../controllers/book.controller.js";
import {jest} from '@jest/globals'

dotenv.config();
validateEnv();
/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});


/* Closing database connection after each test. */
afterAll(async () => {
  const collections = await mongoose.connection.db.collections()

  for (let collection of collections) {
    await collection.drop()
  }
  await mongoose.connection.close();
});

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const user = {
    'firstName': "test1",
    "lastName": "test1",
    "email": "testemail@gmail.com",
    "password": "testtesttest"
}

const mockArgs = () => {
    const args = {}
    args.file = jest.fn().mockReturnValue(args)
    args.title = jest.fn().mockReturnValue(args)
    return args
};

const mockContext = () => {
    const context = {}
    context.req = jest.fn().mockReturnValue(context)
    context.req.get = jest.fn().mockReturnValue("localhost")
    context.getAuthUser = jest.fn().mockReturnValue(context)
    return context
};


let suiteSpecificData = {};

// Test to create new user
test('Should create a new user', async () => {
	const result = await server.executeOperation({
        query: gql`mutation userTest($password: String!, $email: String!, $lastName: String!, $firstName: String!) { 
            createUser(password: $password, email: $email, lastName: $lastName, firstName: $firstName) {
                status
        } }`,
        variables: user
    })
    expect(result.body.singleResult.errors).toBeUndefined();
    expect(result.body.singleResult.data.createUser.status).toBe("success");
});

// Test to login new user
test('Should successfully authenticate a user', async () => {
	const result = await server.executeOperation({
        query: gql`mutation testLogin($email: String!, $password: String!) { 
            userLogin(email: $email, password: $password) {
                status
                access_token
        } }`,
        variables: {
            email: user.email,
            password: user.password
        }
    })
    suiteSpecificData["token"] = result.body.singleResult.data.userLogin.access_token
    expect(result.body.singleResult.errors).toBeUndefined();
    expect(result.body.singleResult.data.userLogin.status).toBe("success");
});

// Test to create new book
test('bookController should successfully create book for login user', async () => {

    const file = fs.createReadStream(path.resolve("./_test_", "./test_file.png"));

    const upload = new Upload();

    const fileUpload = {
      filename: 'test_file.png',
      mimetype: 'image/png',
      encoding: "test",
      createReadStream: () => file,
    };
    upload.promise = new Promise((r) => r(fileUpload));
    upload.file = fileUpload;
    let args = mockArgs()
    args.file = upload.file;
    args.title = "My test book",
    args.author = "Test"

    let context = mockContext()
    context.req = {
        headers: { authorization: `Bearer ${suiteSpecificData["token"]}` },
        get: jest.fn().mockReturnValue("localhost"),
        protocol: "http"
    };

    context.getAuthUser = getAuthUser

    const result = await bookController.createBook({}, args, context )

    suiteSpecificData["bookId"] = result.book.id
    expect(result.errors).toBeUndefined();
    expect(result.status).toBe("success");
});

// Test to create new book
test('bookController should successfully update book for login user', async () => {

    const file = fs.createReadStream(path.resolve("./_test_", "./test_file.png"));
    const title = "update book title";
    const author = "update author name";

    const upload = new Upload();

    const fileUpload = {
      filename: 'test_file.png',
      mimetype: 'image/png',
      encoding: "test",
      createReadStream: () => file,
    };
    upload.promise = new Promise((r) => r(fileUpload));
    upload.file = fileUpload;
    let args = mockArgs()
    args.id = suiteSpecificData["bookId"]
    args.file = upload.file;
    args.title = title
    args.author = author

    let context = mockContext()
    context.req = {
        headers: { authorization: `Bearer ${suiteSpecificData["token"]}` },
        get: jest.fn().mockReturnValue("localhost"),
        protocol: "http"
    };

    context.getAuthUser = getAuthUser

    const result = await bookController.updateBook({}, args, context )

    suiteSpecificData["update_book_title"] = result.book.title

    expect(result.errors).toBeUndefined();
    expect(result.book.id).toBe(suiteSpecificData["bookId"]);
    expect(result.book.title).toBe(title);
    expect(result.book.author).toBe(author);
    expect(result.status).toBe("success");
});

// Test to create new book
test('bookController should successfully return a book with a specified ID', async () => {

    let args = mockArgs()
    args.id = suiteSpecificData["bookId"]

    let context = mockContext()
    context.req = {
        headers: { authorization: `Bearer ${suiteSpecificData["token"]}` },
    };

    context.getAuthUser = getAuthUser

    const result = await bookController.getBook({}, args, context )

    expect(result.errors).toBeUndefined();
    expect(result.book.id).toBe(suiteSpecificData["bookId"]);
    expect(result.book.title).toBe(suiteSpecificData["update_book_title"]);
    expect(result.status).toBe("success");
});

// Test to create new book
test('bookController should successfully return all books', async () => {

    let args = mockArgs()

    let context = mockContext()
    context.req = {
        headers: { authorization: `Bearer ${suiteSpecificData["token"]}` },
    };

    context.getAuthUser = getAuthUser

    const result = await bookController.getBooks({}, args, context )

    expect(result.errors).toBeUndefined();
    expect(result.books[0].id).toBe(suiteSpecificData["bookId"]);
    expect(Array.isArray(result.books)).toBe(true);
    expect(result.status).toBe("success");
});


