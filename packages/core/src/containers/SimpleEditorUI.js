import * as React from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { LibraryAdd, SaveAlt, Visibility, Input } from '@material-ui/icons';

import AnnotationList from '../components/AnnotationList/AnnotationList';
import CanvasList from '../components/CanvasList/CanvasList';
import IIIFCollectionExplorer from '../components/IIIFCollectionExplorer/IIIFCollectionExplorer';
import DLCSPanel from '../components/DLCSExplorer/DLCSPanel';
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
import Layout from '../components/ApplicationLayout/ApplicationLayout';
import AppBar from '../components/ManifestEditorAppBar/ManifestEditorAppBar';
import AppBarButton from '../components/AppBarButton/AppBarButton';
import { loadResource, saveResource } from '../utils/IIIFPersistance';
import DefaultLoadManifestDialog from '../components/DefaultLoadManifestDialog/DefaultLoadManifestDialog';
import convertToV3ifNecessary from '../utils/IIIFUpgrader';

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

const emptyFn = () => {};

const demoManifest = renderResource('Manifest');
const demoCanvas = renderResource('Canvas', {
  parent: demoManifest,
});
demoManifest.items.push(demoCanvas);

class SimpleEditorUI extends React.Component {
  constructor(props) {
    super(props);
    // const initialNewManifest = this.newManifest();
    const stateToRestore = JSON.parse(localStorage.getItem('autoSave'));
    this.state = stateToRestore || {
      resources: {},
      rootResource: null,
      selectedIdsByType: {
        Canvas: null,
        Annotation: null, //demoAnnotation1.id,
      },
      lang: 'en',
    };
  }

  changeLanguage = lang => {
    this.dispatch(EditorReducer, { type: 'CHANGE_LANGUAGE', lang });
  };

  dispatch = (reducer, action, afterStateChange) => {
    this.setState(reducer(this.state, action), () => {
      const currentTime = new Date().getTime();
      const tenSecondsBefore = currentTime - 10000;
      const lastSaveWasMoreThanTenSecondsBefore =
        (window.lastStateSave || 0) < tenSecondsBefore;
      if (
        lastSaveWasMoreThanTenSecondsBefore ||
        action.type === 'LOAD_MANIFEST'
      ) {
        localStorage.setItem(
          'autoSave',
          JSON.stringify(
            Object.assign({}, this.state, {
              loadManifestDialogOpen: false,
              loadManifestDialogOpen2: false,
              saveManifestDialogOpen: false,
              previewModalOpen: false,
            })
          )
        );
        window.lastStateSave = currentTime;
      }
      if (afterStateChange) {
        afterStateChange();
      }
    });
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
      type: 'UPDATE_RESOURCE_PROPERTY',
      options: {
        target,
        property,
        lang,
        value,
      },
    });
  };

  saveProject = () => {
    const { resources, rootResource } = this.state;
    download(
      saveResource(rootResource, resources),
      locale(resources[rootResource].label, this.state.lang) + '.json'
    );
  };

  newProject = () => {
    this.dispatch(IIIFReducer, {
      type: 'LOAD_MANIFEST',
      manifest: this.newManifest(),
    });
  };

  newManifest = () => {
    const newManifest = renderResource('Manifest');
    const newCanvas = renderResource('Canvas', { parent: newManifest });
    newManifest.items.push(newCanvas);
    return newManifest;
  };

  togglePreviewDialog = () => {
    const { resources, rootResource } = this.state;
    this.setState({
      previewDialogOpen: !this.state.previewDialogOpen,
      jsonSnapshot: saveResource(rootResource, resources),
    });
  };

  toggleManifestDialog = () => {
    this.setState({
      loadManifestDialogOpen: !this.state.loadManifestDialogOpen,
    });
  };

  loadManifest = json => {
    this.dispatch(IIIFReducer, {
      type: 'LOAD_MANIFEST',
      manifest: convertToV3ifNecessary(json),
    });
    this.toggleManifestDialog();
  };

  getResource = id => {
    return this.state.resources[id];
  };

  render() {
    const canvases = this.state.rootResource
      ? this.state.resources[this.state.rootResource].items
      : [];

    const selectedCanvas = this.state.selectedIdsByType.Canvas
      ? this.state.resources[this.state.selectedIdsByType.Canvas] || null
      : null;

    const paintingAnnotations =
      selectedCanvas && selectedCanvas.items && selectedCanvas.items.length > 0
        ? this.state.resources[selectedCanvas.items[0]].items || null
        : null;

    const selectedAnnotation = this.state.selectedIdsByType.Annotation
      ? this.state.resources[this.state.selectedIdsByType.Annotation] || null
      : null;
    const { lang } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        <ManifestEditor
          invokeAction={this.invokeAction2}
          config={{
            s3: {
              AMZN_S3_IDENTITY_POOL_HASH:
                '4ef2005b-0ce9-40f9-9e24-b5d50e72c0f1',
              AMZN_S3_REGION: 'eu-west-1',
              AMZN_S3_BUCKET: 'dlcs-dlcservices-test-ingest',
            },
          }}
          behavior={{
            Canvas: {
              groups: [
                {
                  label: 'layout',
                  values: ['layout-overlay', 'layout-split'],
                },
                {
                  label: 'info position',
                  values: [
                    'info-position-left',
                    'info-position-right',
                    'info-position-center',
                  ],
                },
                // ['test-this', 'test-that'],
                '*',
              ],
            },
          }}
          iiifResourceDefaults={{
            Canvas: {
              behavior: ['layout-split', 'info-position-left'],
            },
          }}
          propertyPanel={{
            selectionType: 'accordion',
            selectionVisibility: {
              null: ['Manifest'],
              Canvas: ['Canvas', 'Manifest'],
              Annotation: ['Annotation', 'Canvas', 'Manifest'],
            },
          }}
        >
          <Layout>
            <AppBar>
              <AppBarButton
                text="New Manifest"
                onClick={this.newProject}
                icon={<LibraryAdd />}
              />
              <AppBarButton
                text="Download Manifest"
                onClick={this.saveProject}
                icon={<SaveAlt />}
              />
              <AppBarButton
                text="Preview JSON"
                onClick={this.togglePreviewDialog}
                icon={<Visibility />}
              />
              <AppBarButton
                text="Load Manifest"
                onClick={this.toggleManifestDialog}
                icon={<Input />}
              />
            </AppBar>
            <Layout.Middle>
              <Layout.MiddleContent>
                <Layout.Left>
                  <AnnotationList
                    title="Painting"
                    annotations={paintingAnnotations}
                    lang={lang}
                    selected={this.state.selectedIdsByType.Annotation}
                    select={this.selectResource}
                    remove={this.deleteResource}
                    invokeAction={this.invokeAction2}
                    isEditingAllowed={!!this.state.selectedIdsByType.Canvas}
                    getResource={this.getResource}
                  />
                </Layout.Left>
                <Layout.Center>
                  <EditableCanvasPanel
                    canvas={selectedCanvas}
                    resources={this.state.resources}
                    selectedAnnotation={this.state.selectedIdsByType.Annotation}
                    select={this.selectResource}
                    update={this.updateProperty}
                    getResource={this.getResource}
                  />
                </Layout.Center>
                <Layout.Right>
                  <TabPanel>
                    <Properties
                      manifest={this.state.resources[this.state.rootResource]}
                      canvas={selectedCanvas}
                      annotation={selectedAnnotation}
                      lang={lang}
                      changeLanguage={this.changeLanguage}
                      update={this.updateProperty}
                    />
                    <DLCSPanel title="DLCS" />
                    <IIIFCollectionExplorer title="IIIF Explorer" />
                  </TabPanel>
                </Layout.Right>
              </Layout.MiddleContent>
            </Layout.Middle>
            <Layout.Bottom>
              <CanvasList
                canvas={selectedCanvas}
                canvases={canvases}
                lang={lang}
                selected={this.state.selectedIdsByType.Canvas}
                select={this.selectResource}
                remove={this.deleteResource}
                invokeAction={this.invokeAction}
                getResource={this.getResource}
              />
            </Layout.Bottom>
          </Layout>
        </ManifestEditor>
        <SourcePreviewDialog
          json={this.state.jsonSnapshot}
          open={this.state.previewDialogOpen}
          handleClose={this.togglePreviewDialog}
        />
        <DefaultLoadManifestDialog
          open={this.state.loadManifestDialogOpen}
          loadManifest={this.loadManifest}
          handleClose={this.toggleManifestDialog}
        />
      </MuiThemeProvider>
    );
  }
}

export default SimpleEditorUI;
