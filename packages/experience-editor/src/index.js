import React from 'react';
import ExperienceEditorApp from './containers/ExperienceEditorApp';
import { SnackbarProvider } from 'notistack';
import configs from './defaults';


const App = ({theme, configs}) => (
  <SnackbarProvider maxStack={3}>
    <ExperienceEditorApp theme={theme} configs={configs} />
  </SnackbarProvider>
);

export {
  configs as defaultConfig,
  ExperienceEditorApp,
  App as ExperienceEditorAppWSnackbar,
};