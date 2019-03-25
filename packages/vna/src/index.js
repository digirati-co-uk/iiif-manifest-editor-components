import React from 'react';
import { render } from 'react-dom';

//Start vna manifest editor
import VAMEditor from './containers/VAMEditor';
import { SnackbarProvider } from 'notistack';

const App = () => (
  <SnackbarProvider maxStack={3}>
      <VAMEditor />
  </SnackbarProvider>
);

render(<App />, document.getElementById('app'));
