import cors from "cors";
import { join } from "path";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import * as AppModels from "./models";
import { error, success } from "consola";
import { DB, PORT, IN_PROD } from "./config";
import AuthMiddleware from "./middlewares/auth";
import { typeDefs, resolvers } from "./graphql";
import { ApolloServer } from "apollo-server-express";
import { schemaDirectives } from "./graphql/directives";

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
      introspection: true,
    });

    // App listener will go here
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
