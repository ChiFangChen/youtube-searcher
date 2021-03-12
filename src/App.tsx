import React, { Suspense } from 'react';
import 'fontsource-roboto';
import 'normalize.css';

import './i18n.ts';
import './index.css';
import Spinner from 'components/Spinner';
import Main from 'pages/Main';

function App() {
  return (
    <Suspense fallback={<Spinner wrapperHeight="100vh" />}>
      <Main />
    </Suspense>
  );
}

export default App;
