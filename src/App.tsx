import React, { Suspense } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import 'fontsource-roboto';
import 'normalize.css';

import { rootReducer } from 'modules';
import fetchMiddleWare from 'middlewares/fetchMiddleware';
import Spinner from 'components/Spinner';
import Main from 'pages/Main';
import 'i18n.ts';
import 'index.css';

const store = createStore(
  rootReducer,
  composeWithDevTools({
    stateSanitizer: (state) => state,
  })(applyMiddleware(thunk, fetchMiddleWare)),
);

function App() {
  return (
    <Provider store={store}>
      <Suspense fallback={<Spinner wrapperHeight="100vh" />}>
        <Main />
      </Suspense>
    </Provider>
  );
}

export default App;
