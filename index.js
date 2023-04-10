import dotenv from 'dotenv';
import validateEnv from './utils/validateEnv.js';
import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import resolvers from "./resolvers.js";
import typeDefs from "./typeDefs.js";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from './utils/connectDB.js';
import getAuthUser from './middleware/authUser.js';

dotenv.config();
validateEnv();

( async () => {
    const app = express();
    const httpServer = createServer(app);

    await connectDB();

    const schema = makeExecutableSchema({typeDefs, resolvers});

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: "/qraphql"
    })

    const serverCleanup = useServer({ schema }, wsServer);

    const server = new ApolloServer({
        schema,
        csrfPrevention: true,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose()
                        }
                    }
                }
            }
        ]
    });

    await server.start();

    app.use(
        "/qraphql",
        graphqlUploadExpress(),
        cors(),
        bodyParser.json(),
        expressMiddleware(server, {
            context: async ({ req, res }) => ({ req, res, getAuthUser }),
        }),
    );

    httpServer.listen(process.env.PORT, () => {
        console.log(`Server running on http://localhost:${process.env.PORT}/qraphql`)
    })
 
})()