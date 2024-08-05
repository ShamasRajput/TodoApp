// require('dotenv').config({ path: '.env.local'});

// const express = require('express');
// const mongoose = require('mongoose');
// const { ApolloServer, gql } = require('apollo-server-express');
// const cors = require('cors');

// const app = express();

// // Enable CORS for requests from localhost:3000
// app.use(cors({
//   origin: 'http://localhost:3000', // Allow requests from this origin
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
//   credentials: true // Allow credentials if needed
// }));

// const uri = process.env.MONGO_URI;
// mongoose.connect(uri)
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));

// const TodoSchema = new mongoose.Schema({
//   text: String,
//   completed: Boolean,
//   attachment: String,
//   createdAt: { type: Date, default: Date.now },
// });

// const Todo = mongoose.models.Todo || mongoose.model('Todo', TodoSchema);

// const typeDefs = gql`
//   type Todo {
//     id: ID!
//     text: String!
//     completed: Boolean!
//     attachment: String
//     createdAt: String!
//   }

//   type Query {
//     todos: [Todo!]!
//   }

//   type Mutation {
//     addTodo(text: String!, attachment: String): Todo!
//     updateTodo(id: ID!, text: String, completed: Boolean, attachment: String): Todo
//     deleteTodo(id: ID!): Boolean
//   }
// `;

// const resolvers = {
//   Query: {
//     todos: async () => {
//       return await Todo.find().sort({ createdAt: -1 });
//     },
//   },
//   Mutation: {
//     addTodo: async (_, { text, attachment }) => {
//       const newTodo = new Todo({
//         text,
//         completed: false,
//         attachment,
//         createdAt: new Date(), // Ensure createdAt is set to the current date
//       });
//       return await newTodo.save();
//     },
//     updateTodo: async (_, { id, text, completed, attachment }) => {
//       return await Todo.findByIdAndUpdate(
//         id,
//         { text, completed, attachment },
//         { new: true }
//       );
//     },
//     deleteTodo: async (_, { id }) => {
//       await Todo.findByIdAndDelete(id);
//       return true;
//     },
//   },
// };

// const server = new ApolloServer({ typeDefs, resolvers });

// server.start().then(() => {
//   server.applyMiddleware({ app });

//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
//   });
// });

// pages/api/graphql.js
import { ApolloServer } from 'apollo-server-micro';
import mongoose from 'mongoose';
import Cors from 'micro-cors';

// Environment variable configuration
require('dotenv').config();

// Connect to MongoDB
const uri = process.env.MONGO_URI;
if (!mongoose.connection.readyState) {
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
}

// Define Mongoose schema and model
const TodoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
  attachment: String,
  createdAt: { type: Date, default: Date.now },
});

const Todo = mongoose.models.Todo || mongoose.model('Todo', TodoSchema);

// GraphQL schema
const typeDefs = `
  type Todo {
    id: ID!
    text: String!
    completed: Boolean!
    attachment: String
    createdAt: String!
  }

  type Query {
    todos: [Todo!]!
  }

  type Mutation {
    addTodo(text: String!, attachment: String): Todo!
    updateTodo(id: ID!, text: String, completed: Boolean, attachment: String): Todo
    deleteTodo(id: ID!): Boolean
  }
`;

// GraphQL resolvers
const resolvers = {
  Query: {
    todos: async () => {
      return await Todo.find().sort({ createdAt: -1 });
    },
  },
  Mutation: {
    addTodo: async (_, { text, attachment }) => {
      const newTodo = new Todo({
        text,
        completed: false,
        attachment,
        createdAt: new Date(),
      });
      return await newTodo.save();
    },
    updateTodo: async (_, { id, text, completed, attachment }) => {
      return await Todo.findByIdAndUpdate(
        id,
        { text, completed, attachment },
        { new: true }
      );
    },
    deleteTodo: async (_, { id }) => {
      await Todo.findByIdAndDelete(id);
      return true;
    },
  },
};

// Create Apollo Server
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
});

const startServer = apolloServer.start();

// CORS configuration
const cors = Cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'todo-app-kappa-two-75.vercel.app'
    : 'http://localhost:3000',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
});

// Export serverless function
export default cors(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }
  await startServer;
  return apolloServer.createHandler({ path: '/api/graphql' })(req, res);
});

export const config = {
  api: {
    bodyParser: false,
  },
};
