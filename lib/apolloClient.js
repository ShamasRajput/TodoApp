import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URI, 
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
