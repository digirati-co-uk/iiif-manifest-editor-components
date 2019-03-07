import React, { Component } from 'react';
import {
  createMuiTheme,
  MuiThemeProvider,
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

import ImagePainting from '../annotation/ImagePainting';
import TextLayoutViewFocus from '../annotation/TextLayoutViewFocus';

import Layout from '../components/ApplicationLayout/ApplicationLayout';
import AppBar from '../components/ManifestEditorAppBar/ManifestEditorAppBar';
import AppBarButton from '../components/AppBarButton/AppBarButton';

import './SimpleEditorUI.scss';

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

class VNASlideshowEditor extends React.Component {
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
        <ManifestEditor
          invokeAction={this.invokeAction2}
          config={{
            appBarButtonStyle: 'icon-and-label',
            hideHeaderForSingleTab: true,
          }}
          annotation={{
            'TextualBody::layout-viewport-focus': TextLayoutViewFocus,
            'Image::painting': ImagePainting,
          }}
          metaOntology={{
            'Properties.Annotation': 'Item',
            'Properties.Canvas': 'Slide',
            'Properties.Manifest': 'Slideshow',
            'Canvas.Summary': 'Short description',
            'Canvas.Label': 'Title',
            'Canvas.RequiredStatement': 'Legal notice',
            'Canvas.RequiredStatement.Label': 'Title',
            'Canvas.RequiredStatement.Label': 'Body',
          }}
          behavior={{
            Canvas: {
              groups: [
                {
                  label: 'info-position',
                  values: [
                    'info-position-left',
                    'info-position-right',
                    'info-position-center',
                  ],
                  default: 'info-position-left',
                },
                ['layout-overlay', 'layout-split'],
                '*',
              ],
            },
          }}
        >
          <Layout>
            <AppBar title="Slideshow Editor">
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
                />
              </Layout.Left>
              <Layout.Center>
                <EditableCanvasPanel
                  canvas={selectedCanvas}
                  selectedAnnotation={this.state.selectedIdsByType.Annotation}
                  select={this.selectResource}
                  update={this.updateResource}
                />
              </Layout.Center>
              <Layout.Right>
                <TabPanel>
                  <IIIFCollectionExplorer />
                  <Properties
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
          </Layout>
        </ManifestEditor>
        <SourcePreviewDialog
          json={this.state.rootResource}
          open={this.state.previewDialogOpen}
          handleClose={this.togglePreviewDialog}
        />
      </MuiThemeProvider>
    );
  }
}

export default VNASlideshowEditor;