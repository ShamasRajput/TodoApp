require('dotenv').config({ path: '.env.local' });

const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'https://todo-app-kappa-two-75.vercel.app/', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  credentials: true // Allow credentials if needed
}));

const uri = process.env.MONGO_URI;
mongoose.connect(uri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const TodoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
  attachment: String,
  createdAt: { type: Date, default: Date.now },
});

const Todo = mongoose.model('Todo', TodoSchema);

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
        createdAt: new Date(), // Ensure createdAt is set to the current date
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

const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
  server.applyMiddleware({ app });
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running at ${server.graphqlPath}`);
  });
});
