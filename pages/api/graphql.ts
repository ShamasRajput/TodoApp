// // pages/api/graphql.js
// import { ApolloServer } from 'apollo-server-micro';
// import mongoose from 'mongoose';
// import Cors from 'micro-cors';

// // Environment variable configuration
// require('dotenv').config();

// // Connect to MongoDB
// const uri = process.env.MONGO_URI;
// if (!mongoose.connection.readyState) {
//   mongoose.connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   }).then(() => console.log('MongoDB connected'))
//     .catch(err => console.log(err));
// }

// // Define Mongoose schema and model
// const TodoSchema = new mongoose.Schema({
//   text: String,
//   completed: Boolean,
//   attachment: String,
//   createdAt: { type: Date, default: Date.now },
// });

// const Todo = mongoose.models.Todo || mongoose.model('Todo', TodoSchema);

// // GraphQL schema
// const typeDefs = `
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

// // GraphQL resolvers
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
//         createdAt: new Date(),
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

// // Create Apollo Server
// const apolloServer = new ApolloServer({
//   typeDefs,
//   resolvers,
//   introspection: true,
//   playground: true,
// });

// const startServer = apolloServer.start();

// // CORS configuration
// const cors = Cors({
//   origin: process.env.NODE_ENV === 'production'
//     ? 'https://todo-app-kappa-two-75.vercel.app'
//     : 'http://localhost:3000',
//   allowMethods: ['GET', 'POST', 'OPTIONS'],
// });

// // Export serverless function
// export default cors(async (req, res) => {
//   if (req.method === 'OPTIONS') {
//     res.end();
//     return false;
//   }
//   await startServer;
//   return apolloServer.createHandler({ path: '/api/graphql' })(req, res);
// });

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };


// pages/api/graphql.ts
import { ApolloServer, gql } from 'apollo-server-micro';
import mongoose, { Document, Model } from 'mongoose';
import Cors from 'micro-cors';
import { NextApiRequest, NextApiResponse } from 'next';

// Environment variable configuration
require('dotenv').config();

// Define Mongoose schema and model
interface ITodo extends Document {
  text: string;
  completed: boolean;
  attachment?: string;
  createdAt: Date;
}

const TodoSchema = new mongoose.Schema<ITodo>({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  attachment: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Todo: Model<ITodo> = mongoose.models.Todo || mongoose.model<ITodo>('Todo', TodoSchema);

// Connect to MongoDB
const uri = process.env.MONGO_URI as string;
if (!mongoose.connection.readyState) {
  mongoose.connect(uri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
}

// GraphQL schema
const typeDefs = gql`
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
    todos: async (): Promise<ITodo[]> => {
      return await Todo.find().sort({ createdAt: -1 });
    },
  },
  Mutation: {
    addTodo: async (_: unknown, { text, attachment }: { text: string, attachment?: string }): Promise<ITodo> => {
      const newTodo = new Todo({
        text,
        completed: false,
        attachment,
        createdAt: new Date(),
      });
      return await newTodo.save();
    },
    updateTodo: async (_: unknown, { id, text, completed, attachment }: { id: string, text?: string, completed?: boolean, attachment?: string }): Promise<ITodo | null> => {
      return await Todo.findByIdAndUpdate(
        id,
        { text, completed, attachment },
        { new: true }
      );
    },
    deleteTodo: async (_: unknown, { id }: { id: string }): Promise<boolean> => {
      await Todo.findByIdAndDelete(id);
      return true;
    },
  },
};

// Create Apollo Server
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers
});

const startServer = apolloServer.start();

// CORS configuration
const cors = Cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://todo-app-kappa-two-75.vercel.app'
    : 'http://localhost:3000',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
});

// Export serverless function
export default cors(async (req: NextApiRequest, res: NextApiResponse) => {
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
