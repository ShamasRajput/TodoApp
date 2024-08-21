import { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import store from '../src/services/redux/store';
import client from '../src/lib/apolloClient';
import 'tailwindcss/tailwind.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </ApolloProvider>
  );
}

export default MyApp;
