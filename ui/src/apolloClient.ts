import {ApolloClient, ApolloLink, concat, HttpLink, InMemoryCache} from '@apollo/client';
import {store} from './store';
import {serverUrl} from './urls';

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(
    new ApolloLink((operation, forward) => {
      const token = store.getState().user.user?.token;

      operation.setContext({
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined
        }
      });

      return forward(operation);
    }),
    new HttpLink({uri: `${serverUrl}/graphql`})
  ),
  defaultOptions: {
    query: {fetchPolicy: 'no-cache'},
    mutate: {fetchPolicy: 'no-cache'},
    watchQuery: {fetchPolicy: 'no-cache'}
  }
});
