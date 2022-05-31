import {StrictMode} from 'react';
import './index.css';
import {App} from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom';
import {ApolloClient, ApolloLink, ApolloProvider, concat, HttpLink, InMemoryCache} from '@apollo/client';
import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import {serverUrl} from './urls';
import {Provider} from 'react-redux';
import {store} from './store';

import common_de from './locales/de/common.json';
import common_en from './locales/en/common.json';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {createRoot} from 'react-dom/client';

// noinspection JSIgnoredPromiseFromCall
i18next
  .use(initReactI18next)
  .init({
    resources: {
      de: {common: common_de},
      en: {common: common_en}
    },
    lng: 'de',
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false
    }
  });

const apolloClient = new ApolloClient({

  cache: new InMemoryCache(),
  link: concat(
    new ApolloLink((operation, forward) => {
      operation.setContext({
        headers: {
          authorization: store.getState().currentUser?.jwt || null
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

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Could not create app...');
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ApolloProvider client={apolloClient}>
          <DndProvider backend={HTML5Backend}>
            <App/>
          </DndProvider>
        </ApolloProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
