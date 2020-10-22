import { error, success } from "consola";

import { join } from "path";

import cors from "cors";

import { ApolloServer } from "apollo-server-express";

import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import * as AppModels from "./models";

import { DB, PORT, IN_PROD } from "./config";

import { typeDefs, resolvers } from "./graphql";

import { schemaDirectives } from "./graphql/directives";

import AuthMiddleware from "./middlewares/auth";

// Initialize the Express Application
const app = express();
app.use(cors());
app.use(AuthMiddleware);
app.use(bodyParser.json());
app.use(express.static(join(__dirname, "./uploads")));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives,
  playground: true,
  context: ({ req }) => {
    let { isAuth, user } = req;

    return {
      req,
      isAuth,
      user,
      ...AppModels,
    };
  },
});

const startApp = async () => {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    success({
      badge: true,
      message: `Successfully connected with the Database.`,
    });
    // Inject Apollo server middleware on Express Application
    server.applyMiddleware({
      app,
      cors: false,
    });
    app.listen(PORT, () =>
      success({
        badge: true,
        message: `Server started on PORT ${PORT}`,
      })
    );
  } catch (err) {
    error({
      badge: true,
      message: err.message,
    });
  }
};

startApp();
