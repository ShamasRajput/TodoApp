import { ApolloProvider } from '@apollo/client';
import client from '../lib/apolloClient';
import { TodoProvider } from '../context/TodoContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <TodoProvider>
        <Component {...pageProps} />
      </TodoProvider>
    </ApolloProvider>
  );
}

export default MyApp;
