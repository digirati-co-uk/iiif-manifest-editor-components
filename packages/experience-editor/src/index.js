import React from 'react';
import { render } from 'react-dom';

import { createMuiTheme } from '@material-ui/core';
//Start vna manifest editor
import ExperienceEditorApp from './containers/ExperienceEditorApp';
import { SnackbarProvider } from 'notistack';
import configs from './defaults';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#00d0b8',
      contrastText: '#fff',
    },
    secondary: {
      main: '#fff',
      contrastText: '#00d0b8',
    },
  },
  typography: {
    fontSize: 12,
    useNextVariants: true,
  },
  mixins: {
    toolbar: {
      minHeight: 36,
    },
  },
});

const App = () => (
  <SnackbarProvider maxStack={3}>
    <ExperienceEditorApp theme={theme} configs={configs}/>
  </SnackbarProvider>
);

render(<App />, document.getElementById('app'));
