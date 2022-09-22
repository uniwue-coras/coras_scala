import {StrictMode} from 'react';
import './index.css';
import {App} from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom';
import {ApolloClient, ApolloLink, ApolloProvider, concat, HttpLink, InMemoryCache} from '@apollo/client';
import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import {serverUrl} from './urls';
import {Provider as StoreProvider} from 'react-redux';
import {store} from './newStore';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {createRoot} from 'react-dom/client';
import common_de from './locales/common_de.json';
import common_en from './locales/common_en.json';

// noinspection JSIgnoredPromiseFromCall
i18next
  .use(initReactI18next)
  .init({
    fallbackLng: 'de',
    resources: {
      de: {common: common_de},
      en: {common: common_en}
    }
  });

// Apollo

const apolloClient = new ApolloClient({
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

const root = createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <BrowserRouter>
      <StoreProvider store={store}>
        <ApolloProvider client={apolloClient}>
          <DndProvider backend={HTML5Backend}>
            <App/>
          </DndProvider>
        </ApolloProvider>
      </StoreProvider>
    </BrowserRouter>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
