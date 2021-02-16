import { ApolloClient, InMemoryCache } from '@apollo/client';

const inMemoryCache = new InMemoryCache({
  typePolicies: {
    Profile: {
      keyFields: ['name'],
    },
  },
});

export default new ApolloClient({
  uri: '/graphql',
  cache: inMemoryCache,
  connectToDevTools: true,
  queryDeduplication: false,
  errorPolicy: 'all',
});
