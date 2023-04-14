import gql from "graphql-tag";
import { ApolloServer } from "@apollo/server";
import resolvers from "../resolvers.js";
import typeDefs from "../typeDefs.js";
import mongoose from "mongoose";

/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect("mongodb://uiwdoykwij7cshk:r7PDU4Y9QAs2RqCSpR1w@bvf5dsw0xc1t1j6-mongodb.services.clever-cloud.com:27017/bvf5dsw0xc1t1j6");
});


/* Closing database connection after each test. */
afterEach(async () => {
  const collections = await mongoose.connection.db.collections()

  for (let collection of collections) {
    await collection.drop()
  }
  await mongoose.connection.close();
});

const server = new ApolloServer({
    typeDefs,
    resolvers,
    persistedQueries: {
        ttl: 900, // 15 minutes
      },
});

const user = {
    'firstName': "test1",
    "lastName": "test1",
    "email": "testemail@gmail.com",
    "password": "testtesttest"
}

// Test to create new user
test('Create new user', async () => {
	const result = await server.executeOperation({
        query: gql`mutation userTest($password: String!, $email: String!, $lastName: String!, $firstName: String!) { 
            createUser(password: $password, email: $email, lastName: $lastName, firstName: $firstName) {
                status
        } }`,
        variables: user
    })
    console.log(result.body.singleResult)
    expect(result.body.singleResult.errors).toBeUndefined();
});
