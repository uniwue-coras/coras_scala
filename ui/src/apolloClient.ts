import { ApolloClient, ApolloLink, from, HttpLink, InMemoryCache } from '@apollo/client';
import { store } from './store';
import { serverUrl } from './urls';
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename';

const addAuthorizationLink = new ApolloLink((operation, forward) => {
  const token = store.getState().user.user?.token;

  operation.setContext({
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined
    }
  });

  return forward(operation);
});

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([
    removeTypenameFromVariables(),
    addAuthorizationLink,
    new HttpLink({ uri: `${serverUrl}/graphql` }),
  ]),
  defaultOptions: {
    query: { fetchPolicy: 'no-cache' },
    mutate: { fetchPolicy: 'no-cache' },
    watchQuery: { fetchPolicy: 'no-cache' }
  }
});
