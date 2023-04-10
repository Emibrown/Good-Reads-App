// GraphQL Resolvers
const resolvers = {

  Query: {
    hello: () => "Hello Good Reads App",
    welcome: (parent, args) => `Hello ${args.name}`,
  },

};

export default resolvers