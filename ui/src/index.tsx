import {StrictMode} from 'react';
import './index.css';
import {router} from './router';
import {RouterProvider} from 'react-router-dom';
import {ApolloProvider} from '@apollo/client';
import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import {Provider as StoreProvider} from 'react-redux';
import {store} from './store';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {createRoot} from 'react-dom/client';
import common_de from './locales/common_de.json';
import common_en from './locales/common_en.json';
import {apolloClient} from './apolloClient';

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

const root = createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <StoreProvider store={store}>
      <ApolloProvider client={apolloClient}>
        <DndProvider backend={HTML5Backend}>
          <RouterProvider router={router}/>
        </DndProvider>
      </ApolloProvider>
    </StoreProvider>
  </StrictMode>
);
