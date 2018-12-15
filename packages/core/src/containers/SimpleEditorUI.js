import React from 'react';
import {
  createMuiTheme,
  MuiThemeProvider,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from '@material-ui/core';
import { LibraryAdd, SaveAlt, Visibility } from '@material-ui/icons';

import AnnotationList from '../components/AnnotationList/AnnotationList';
import CanvasList from '../components/CanvasList/CanvasList';
import IIIFCollectionExplorer from '../components/IIIFCollectionExplorer/IIIFCollectionExplorer';
import EditableCanvasPanel from '../components/EditableCanvasPanel/EditableCanvasPanel';
import Properties from '../components/Properties/Properties';
import TabPanel from '../components/TabPanel/TabPanel';
import renderResource, {
  queryResourceById,
  locale,
} from '../utils/IIIFResource';
import ManifestEditor from '../components/ManifestEditor/ManifestEditor';
import SourcePreviewDialog from '../components/SourcePreviewDialog/SourcePreviewDialog';
import IIIFReducer from '../reducers/iiif';
import EditorReducer from '../reducers/editor';
import download from '../utils/download';
import DefaultTooltip from '../components/DefaultTooltip/DefaultTooltip';

import './SimpleEditorUI.scss';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#59bfec',
      contrastText: '#fff',
    },
    secondary: {
      main: '#fff',
      contrastText: '#59bfec',
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

const demoManifest = renderResource('Manifest');
const demoCanvas = renderResource('Canvas', { parent: demoManifest });
demoManifest.items.push(demoCanvas);

class SimpleEditorUI extends React.Component {
  state = {
    rootResource: demoManifest,
    selectedIdsByType: {
      Canvas: demoCanvas.id,
      Annotation: null, //demoAnnotation1.id,
    },
    lang: 'en',
  };

  changeLanguage = lang => {
    this.dispatch(EditorReducer, { type: 'CHANGE_LANGUAGE', lang });
  };

  dispatch = (reducer, action) => {
    this.setState(reducer(this.state, action));
  };

  selectResource = resource => {
    this.dispatch(EditorReducer, {
      type: 'TOGGLE_SELECT_RESOURCE',
      resource,
    });
  };

  deleteResource = resource => {
    this.dispatch(IIIFReducer, {
      type: 'REMOVE_RESOURCE',
      id: resource.id,
    });
  };

  invokeAction2 = (fn, options) => () => {
    if (!fn) {
      return;
    }

    fn(
      {
        state: this.state,
        dispatch: this.dispatch,
      },
      options
    );
  };
  //TODO: deprecated replaced by the above
  invokeAction = (action, options) => {
    switch (action) {
      case 'add-canvas':
        this.dispatch(IIIFReducer, {
          type: 'ADD_RESOURCE',
          options: {
            type: 'Canvas',
            parent: this.state.rootResource,
          },
        });
        break;
      default:
        break;
    }
  };

  updateProperty = (target, property, lang, value) => {
    //TODO: should be just a dispatch,
    const targetClone = JSON.parse(JSON.stringify(target));
    let currentLevel = targetClone;
    property.split('.').forEach(key => {
      if (!currentLevel[key]) {
        if (key === 'metadata') {
          currentLevel[key] = [];
        } else {
          currentLevel[key] = {};
        }
      }
      currentLevel = currentLevel[key];
    });
    currentLevel[lang] = value.split('\n');
    this.dispatch(IIIFReducer, {
      type: 'UPDATE_RESOURCE',
      options: {
        id: target.id,
        props: targetClone,
      },
    });
  };

  updateResource = (target, props) => {
    this.dispatch(IIIFReducer, {
      type: 'UPDATE_RESOURCE',
      options: {
        id: target.id,
        props,
      },
    });
  };

  saveProject = () => {
    download(
      this.state.rootResource,
      locale(this.state.rootResource.label, this.state.lang) + '.json'
    );
  };

  newProject = () => {
    const newManifest = renderResource('Manifest');
    const newCanvas = renderResource('Canvas', { parent: demoManifest });
    newManifest.items.push(newCanvas);
    this.dispatch(IIIFReducer, {
      type: 'LOAD_MANIFEST',
      manifest: newManifest,
    });
  };

  togglePreviewDialog = () => {
    this.setState({
      previewDialogOpen: !this.state.previewDialogOpen,
    });
  };

  render() {
    const canvases = this.state.rootResource
      ? this.state.rootResource.items
      : [];
    const selectedCanvas = queryResourceById(
      this.state.selectedIdsByType.Canvas,
      this.state.rootResource
    );
    const annotations =
      selectedCanvas && selectedCanvas.items && selectedCanvas.items.length > 0
        ? selectedCanvas.items[0].items || null
        : null;
    const selectedAnnotation = queryResourceById(
      this.state.selectedIdsByType.Annotation,
      selectedCanvas
    );
    const { lang } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        <div className="simple-manifest-editor">
          <ManifestEditor invokeAction={this.invokeAction2}>
            <AppBar position="static">
              <Toolbar>
                <Typography color="secondary" variant="h6">
                  Manifest Editor
                </Typography>
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'canter',
                    justifyContent: 'flex-end',
                  }}
                >
                  <DefaultTooltip title="New Manifest" placement="bottom">
                    <IconButton color="secondary" onClick={this.newProject}>
                      <LibraryAdd />
                    </IconButton>
                  </DefaultTooltip>
                  <DefaultTooltip title="Download Manifest" placement="bottom">
                    <IconButton color="secondary" onClick={this.saveProject}>
                      <SaveAlt />
                    </IconButton>
                  </DefaultTooltip>
                  <DefaultTooltip title="Preview JSON" placement="bottom">
                    <IconButton
                      color="secondary"
                      onClick={this.togglePreviewDialog}
                    >
                      <Visibility />
                    </IconButton>
                  </DefaultTooltip>
                </div>
              </Toolbar>
            </AppBar>
            <div className="simple-manifest-editor__center">
              <div className="simple-manifest-editor__left-panel">
                <AnnotationList
                  annotations={annotations}
                  lang={lang}
                  selected={this.state.selectedIdsByType.Annotation}
                  select={this.selectResource}
                  remove={this.deleteResource}
                  invokeAction={this.invokeAction2}
                />
              </div>
              <div className="simple-manifest-editor__canvas">
                <EditableCanvasPanel
                  canvas={selectedCanvas}
                  selectedAnnotation={this.state.selectedIdsByType.Annotation}
                  select={this.selectResource}
                  update={this.updateResource}
                />
              </div>
              <div className="simple-manifest-editor__right-panel">
                <TabPanel>
                  <IIIFCollectionExplorer />
                  <Properties
                    manifest={this.state.rootResource}
                    canvas={selectedCanvas}
                    annotation={selectedAnnotation}
                    lang={lang}
                    changeLanguage={this.changeLanguage}
                    update={this.updateProperty}
                  />
                </TabPanel>
              </div>
            </div>
            <div className="simple-manifest-editor__bottom">
              <CanvasList
                canvases={canvases}
                lang={lang}
                selected={this.state.selectedIdsByType.Canvas}
                select={this.selectResource}
                remove={this.deleteResource}
                invokeAction={this.invokeAction}
              />
            </div>
          </ManifestEditor>
        </div>
        <SourcePreviewDialog
          json={this.state.rootResource}
          open={this.state.previewDialogOpen}
          handleClose={this.togglePreviewDialog}
        />
      </MuiThemeProvider>
    );
  }
}

export default SimpleEditorUI;
