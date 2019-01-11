import React from 'react';
import {
  createMuiTheme,
  MuiThemeProvider,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from '@material-ui/core';
import {
  LibraryAdd,
  SaveAlt,
  Visibility,
  GridOn,
  GridOff,
} from '@material-ui/icons';

import AnnotationList from '../components/AnnotationList/AnnotationList';
import CanvasList from '../components/CanvasList/CanvasList';
import IIIFCollectionExplorer from '../components/IIIFCollectionExplorer/IIIFCollectionExplorer';
import EditableCanvasPanel from '../components/EditableCanvasPanel/EditableCanvasPanel';
import Properties from '../components/Properties/Properties';
import TabPanel from '../components/TabPanel/TabPanel';
import renderResource, {
  queryResourceById,
  locale,
  update,
} from '../utils/IIIFResource';
import ManifestEditor from '../components/ManifestEditor/ManifestEditor';
import SourcePreviewDialog from '../components/SourcePreviewDialog/SourcePreviewDialog';
import IIIFReducer from '../reducers/iiif';
import EditorReducer from '../reducers/editor';
import download from '../utils/download';
import DefaultTooltip from '../components/DefaultTooltip/DefaultTooltip';

import TextPainting from '../annotation/TextPainting';
import ImagePainting from '../annotation/ImagePainting';
import VideoPainting from '../annotation/VideoPainting';
import ExhibitionPreview from './TUDelftManifestEditor.ExhibitionPreview';

import './TUDelftManifestEditor.scss';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1d1c73',
      contrastText: '#fff',
    },
    secondary: {
      main: '#fff',
      contrastText: '#1d1c73',
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

const emptyFn = () => {};

const demoManifest = renderResource('Manifest');
const demoCanvas = renderResource('Canvas', { parent: demoManifest });
demoManifest.items.push(demoCanvas);

class TUDelftManifestEditor extends React.Component {
  state = {
    rootResource: demoManifest,
    selectedIdsByType: {
      Canvas: demoCanvas.id,
      Annotation: null, //demoAnnotation1.id,
    },
    lang: 'en',
    exhibitionMode: false,
    exhibitionFullView: false,
  };

  changeLanguage = lang => {
    this.dispatch(EditorReducer, { type: 'CHANGE_LANGUAGE', lang });
  };

  dispatch = (reducer, action, cb) => {
    this.setState(reducer(this.state, action), cb || emptyFn);
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
    this.dispatch(IIIFReducer, {
      type: 'UPDATE_RESOURCE',
      options: {
        id: target.id,
        props: update(target, property, lang, value),
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

  toggleExhibitionMode = () => {
    this.setState({
      exhibitionMode: !this.state.exhibitionMode,
    });
  };

  toggleExhibitionFullView = () => {
    this.setState({
      exhibitionFullView: !this.state.exhibitionFullView,
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
        <div
          className={[
            'tu-delft-manifest-editor',
            this.state.exhibitionMode
              ? 'tu-delft-manifest-editor--exhibition-mode'
              : '',
            this.state.exhibitionFullView
              ? 'tu-delft-manifest-editor--exhibition-full-view'
              : '',
          ].join(' ')}
        >
          <ManifestEditor
            invokeAction={this.invokeAction2}
            annotation={{
              'TextualBody::painting': TextPainting,
              'Image::painting': ImagePainting,
              'Video::painting': VideoPainting,
            }}
            translation={{
              defaultLanguage: 'en',
              languages: [
                {
                  name: 'English',
                  local: 'English',
                  1: 'en',
                  2: 'eng',
                  '2T': 'eng',
                  '2B': 'eng',
                  3: 'eng',
                },
                {
                  name: 'Dutch',
                  local: 'Nederlands',
                  1: 'nl',
                  2: 'nld',
                  '2T': 'nld',
                  '2B': 'dut',
                  3: 'nld',
                },
              ],
            }}
          >
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
                  <DefaultTooltip
                    title="Exhibition/Standard"
                    placement="bottom"
                  >
                    <IconButton
                      color="secondary"
                      onClick={this.toggleExhibitionMode}
                    >
                      {this.state.exhibitionMode ? <GridOn /> : <GridOff />}
                    </IconButton>
                  </DefaultTooltip>
                </div>
              </Toolbar>
            </AppBar>
            <div className="tu-delft-manifest-editor__center">
              <div className="tu-delft-manifest-editor__left-panel">
                {this.state.exhibitionMode ? (
                  <TabPanel>
                    <ExhibitionPreview
                      canvases={canvases}
                      manifest={this.state.rootResource}
                      direction="vertical"
                      lang={lang}
                      selected={this.state.selectedIdsByType.Canvas}
                      select={this.selectResource}
                      remove={this.deleteResource}
                      invokeAction={this.invokeAction}
                      toggleZoom={this.toggleExhibitionFullView}
                    />
                    <AnnotationList
                      title="annotations"
                      annotations={annotations}
                      lang={lang}
                      selected={this.state.selectedIdsByType.Annotation}
                      select={this.selectResource}
                      remove={this.deleteResource}
                      invokeAction={this.invokeAction2}
                    />
                  </TabPanel>
                ) : (
                  <AnnotationList
                    annotations={annotations}
                    lang={lang}
                    selected={this.state.selectedIdsByType.Annotation}
                    select={this.selectResource}
                    remove={this.deleteResource}
                    invokeAction={this.invokeAction2}
                  />
                )}
              </div>
              {!(
                this.state.exhibitionMode && this.state.exhibitionFullView
              ) && (
                <div className="tu-delft-manifest-editor__canvas">
                  <EditableCanvasPanel
                    canvas={selectedCanvas}
                    selectedAnnotation={this.state.selectedIdsByType.Annotation}
                    select={this.selectResource}
                    update={this.updateResource}
                  />
                </div>
              )}
              <div className="tu-delft-manifest-editor__right-panel">
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
            {!this.state.exhibitionMode && (
              <div className="tu-delft-manifest-editor__bottom">
                <CanvasList
                  canvases={canvases}
                  lang={lang}
                  selected={this.state.selectedIdsByType.Canvas}
                  select={this.selectResource}
                  remove={this.deleteResource}
                  invokeAction={this.invokeAction}
                />
              </div>
            )}
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

export default TUDelftManifestEditor;
