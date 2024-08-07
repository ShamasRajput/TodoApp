// lib/apolloClient.ts

import { ApolloClient, InMemoryCache, createHttpLink, NormalizedCacheObject } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Ensure environment variables are defined
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URI as string, 
});

const authLink = setContext((_, { headers }) => {
  const token = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;  
  return {
    headers: {
      ...headers,
      apikey: token,
      authorization: `Bearer ${token}`,
    },
  };
});

// Create Apollo Client
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
