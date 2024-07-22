import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'https://hxxrkmykcgsgnbwvxrzo.supabase.co/graphql/v1', 
});

const authLink = setContext((_, { headers }) => {
  const token = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; 
  return {
    headers: {
      ...headers,
      apikey: token,
      authorization: `Bearer ${token}`,
    }
  };    
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default client;
