import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import store from '../redux/store';
import client from '../lib/apolloClient';
import 'tailwindcss/tailwind.css';

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </ApolloProvider>
  );
}

export default MyApp;
