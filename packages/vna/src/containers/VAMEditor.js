import React from 'react';
import * as classnames from 'classnames';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import {
  LibraryAdd,
  LibraryBooks,
  SaveAlt,
  Visibility,
  Input,
} from '@material-ui/icons';

import {
  // components
  AnnotationList,
  CanvasList,
  IIIFCollectionExplorer,
  EditableCanvasPanel,
  Properties,
  TabPanel,
  ManifestEditor,
  SourcePreviewDialog,
  DefaultLoadManifestDialog,
  ManifestEditorAppBar as AppBar,
  ApplicationLayout as Layout,
  AppBarButton,
  // annotation 
  TextLayoutViewFocus,
  ImagePainting,
  // utils
  renderResource,
  queryResourceById,
  locale,
  update,
  download,
  convertToV3ifNecessary,
  // Reducers
  IIIFReducer,
  EditorReducer,
} from '@IIIF-MEC/core';

import EditorModeSelector from '../components/EditorModeSelector';
import LoadManifestModal from '../components/LoadManifestModal';
import SaveManifestModal from '../components/SaveManifestModal';
import PreviewModal from '../components/PreviewModal';
import SlideEditor from '../components/SlideEditor';
import TextualBodyDescribing from '../annotation/TextualBodyDescribing';
import './VAMEditor.scss';

const isLocalhost = () => 
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "0.0.0.0"   
// Temporary override until the settings panel hasn't been funded.
window.rootManifestUrl = isLocalhost()
  ? 'http://localhost:8181/p3/'
  : 'http://iiif-collection.ch.digtest.co.uk/p3/';
const emptyFn = () => {};

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#000',
      contrastText: '#ff9a00',
    },
    secondary: {
      main: '#ff9a00',
      contrastText: '#000',
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

const SLIDESHOW_BEHAVIOURS = {
  Canvas: {
    groups: [
      {
        label: 'info position',
        values: [
          'info-position-left',
          'info-position-right',
          'info-position-center',
        ],
        default: 'info-position-left',
      },
      {
        label: 'layout', 
        values: ['layout-overlay', 'layout-split'],
        default: 'layout-split',
      },
      '*',
    ],
  },
};

const SLIDESHOW_PROPERTIES_LABEL = {
  'Properties.Annotation': 'Item',
  'Properties.Canvas': 'Slide',
  'Properties.Manifest': 'Slideshow',
  'Canvas.Summary': 'Short description',
  'Canvas.Label': 'Title',
  'Canvas.RequiredStatement': 'Legal notice',
  'Canvas.RequiredStatement.Label': 'Title',
  'Canvas.RequiredStatement.Label': 'Body',
  'Canvas.Metadata': 'Additional info',
  'Canvas.Metadata.Label': 'Title',
};

class VAMEditor extends React.Component {
  state = {
    rootResource: demoManifest,
    selectedIdsByType: {
      Canvas: demoCanvas.id,
      Annotation: null, //demoAnnotation1.id,
    },
    lang: 'en',
    editorMode: 'slideshow', 
    loadManifestDialogOpen: false,
    saveManifestDialogOpen: false,
    previewModalOpen: false,
  };

  changeLanguage = lang => {
    this.dispatch(EditorReducer, { type: 'CHANGE_LANGUAGE', lang });
  };

  dispatch = (reducer, action, afterStateChange) => {
    this.setState(reducer(this.state, action), afterStateChange);
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

  updateProperty = (target, property, lang, value, afterStateChange) => {
    this.dispatch(IIIFReducer, {
      type: 'UPDATE_RESOURCE',
      options: {
        id: target.id,
        props: update(target, property, lang, value),
      },
    }, afterStateChange);
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

  regenerateIds = (manifestId, afterStateChange) => {
    this.dispatch(IIIFReducer, {
      type: 'REGENERATE_IDS',
      manifestId, 
    }, afterStateChange);
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

  setEditorMode = (ev, selectedElement) => {
    this.setState({
      editorMode: selectedElement.props.value,
    }, () => {
      const behaviours = (this.state.rootResource.behavior || []).filter(item=>item!=='vam-slideshow' && item !=='vam-annotated-zoom'); 
      if (selectedElement.props.value !== 'default') {
        behaviours.push('vam-' + selectedElement.props.value);
      }
      this.updateProperty(
        this.state.rootResource, 
        'behavior', 
        null, 
        behaviours
      )
    });

  };

  toggleLoadManifestDialog = () => {
    this.setState({
      loadManifestDialogOpen: !this.state.loadManifestDialogOpen,
    });
  };

  toggleLoadManifestDialog2 = () => {
    this.setState({
      loadManifestDialogOpen2: !this.state.loadManifestDialogOpen2,
    });
  };

  toggleSaveManifestDialog = () => {
    this.setState({
      saveManifestDialogOpen: !this.state.saveManifestDialogOpen,
    });
  };

  toggleItemPreview = () => {
    this.setState({
      previewModalOpen: !this.state.previewModalOpen,
    });
  };


  loadManifest = json => {
    this.dispatch(IIIFReducer, {
      type: 'LOAD_MANIFEST',
      manifest: convertToV3ifNecessary(json),
    });
    if (this.state.loadManifestDialogOpen) {
      this.toggleLoadManifestDialog();
    }
    if(this.state.loadManifestDialogOpen2) {
      this.toggleLoadManifestDialog2();
    }
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
    const { lang, editorMode } = this.state;
    const annotationConfig = {
      'Image::painting': ImagePainting,
    };
    if (editorMode !== 'slideshow') {
      annotationConfig['TextualBody::describing'] =  TextualBodyDescribing;
    }
    if (editorMode !== 'annotated-zoom') {
      annotationConfig['TextualBody::layout-viewport-focus'] = TextLayoutViewFocus;
    }
    return (
      <MuiThemeProvider theme={theme}>
        <ManifestEditor
          invokeAction={this.invokeAction2}
          config={{
            appBarButtonStyle: 'icon-and-label',
            hideHeaderForSingleTab: true,
          }}
          annotation={annotationConfig}
          metaOntology={editorMode === 'slideshow' ? SLIDESHOW_PROPERTIES_LABEL: {}}
          behavior={editorMode === 'slideshow' ? SLIDESHOW_BEHAVIOURS:  {}}
        >
          <Layout>
            <AppBar titleComponent={
              <EditorModeSelector selected={editorMode} onSelect={this.setEditorMode} />
            }>
              <AppBarButton
                text="New Manifest"
                onClick={this.newProject}
                icon={<LibraryAdd />}
              />
              <AppBarButton
                text="Load Manifest"
                onClick={this.toggleLoadManifestDialog}
                icon={<LibraryBooks />}
              />
              <AppBarButton
                text="Save Manifest"
                onClick={this.toggleSaveManifestDialog}
                icon={<LibraryBooks />}
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
                text="Preview"
                onClick={this.toggleItemPreview}
                icon={<Visibility />}
              />
              <AppBarButton
                text="Load Manifest"
                onClick={this.toggleLoadManifestDialog2}
                icon={<Input />}
              />
            </AppBar>
            <Layout.Middle>
              <Layout.Left>
                <AnnotationList
                  annotations={annotations}
                  lang={lang}
                  selected={this.state.selectedIdsByType.Annotation}
                  select={this.selectResource}
                  remove={this.deleteResource}
                  invokeAction={this.invokeAction2}
                  selectedColor="secondary"
                />
              </Layout.Left>
              <Layout.Center>
                {editorMode === 'slideshow' ? (
                  <SlideEditor manifestJSON={this.state.rootResource} canvasId={this.state.selectedIdsByType.Canvas} />
                ) : (
                  <EditableCanvasPanel
                    canvas={selectedCanvas}
                    selectedAnnotation={this.state.selectedIdsByType.Annotation}
                    select={this.selectResource}
                    update={this.updateResource}
                  />
                )}
              </Layout.Center>
              <Layout.Right>
                <TabPanel>
                  <IIIFCollectionExplorer
                    title="IIIF Collection Explorer"
                    url={window.rootManifestUrl}
                  />
                  <Properties
                    title="Properties"
                    manifest={this.state.rootResource}
                    canvas={selectedCanvas}
                    annotation={selectedAnnotation}
                    lang={lang}
                    changeLanguage={this.changeLanguage}
                    update={this.updateProperty}
                    noTranslation={true}
                  />
                </TabPanel>
              </Layout.Right>
            </Layout.Middle>
            {editorMode !== 'annotated-zoom' && (
              <Layout.Bottom>
                <CanvasList
                  canvases={canvases}
                  lang={lang}
                  selected={this.state.selectedIdsByType.Canvas}
                  select={this.selectResource}
                  remove={this.deleteResource}
                  invokeAction={this.invokeAction}
                />
              </Layout.Bottom>
            )}
          </Layout>
        </ManifestEditor>
        <SourcePreviewDialog
          json={this.state.rootResource}
          open={this.state.previewDialogOpen}
          handleClose={this.togglePreviewDialog}
        />
        <LoadManifestModal
          open={this.state.loadManifestDialogOpen}
          handleClose={this.toggleLoadManifestDialog}
          collectionURL={window.rootManifestUrl}
          loadManifest={this.loadManifest}
        />
        <PreviewModal
          open={this.state.previewModalOpen}
          handleClose={this.toggleItemPreview}
          manifest={this.state.rootResource}
        />
        {this.state.saveManifestDialogOpen && (
          <SaveManifestModal
            manifest={this.state.rootResource}
            open={this.state.saveManifestDialogOpen}
            handleClose={this.toggleSaveManifestDialog}
            regenerateIds={this.regenerateIds}
          />
        )}
        <DefaultLoadManifestDialog
          open={this.state.loadManifestDialogOpen2}
          loadManifest={this.loadManifest}
          handleClose={this.toggleLoadManifestDialog2}
        />
      </MuiThemeProvider>
    );
  }
}

export default VAMEditor;