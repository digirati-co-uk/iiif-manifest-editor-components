import * as React from 'react';
import * as PropTypes from 'prop-types';
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

class ManifestEditorApp extends React.Component {
  constructor(props) {
    super(props);
    //const initialNewManifest = this.newManifest();
    const stateToRestore = JSON.parse(localStorage.getItem('autoSave'));
    this.state = stateToRestore || {
      resources: {},
      rootResource: null,
      selectedIdsByType: {
        Canvas: null,
        Annotation: null,
      },
      lang: 'en',
    };
    this.dialogs = [{
      renderer: this.renderSourcePreviewDialog,
      openState: 'previewDialogOpen'
    }, {
      renderer: this.renderDefaultLoadManifestDialog,
      openState: 'loadManifestDialogOpen'
    }];
  }

  changeLanguage = lang => {
    this.dispatch(EditorReducer, { type: 'CHANGE_LANGUAGE', lang });
  };

  resetDialogs = () => 
    this.dialogs.reduce((dialogStates, dialog) => {
      dialogStates[dialog.openState] = false;
      return dialogStates;
    }, {});

  prepareAutoSave = () =>
    JSON.stringify(
      Object.assign(
        {}, 
        this.state, 
        this.resetDialogs()
      )
    )

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
          'autoSave', this.prepareAutoSave()
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

  /**
   * Override this if for different buttons
   * @memberof ManifestEditorApp
   */
  renderAppBarButtons = () => (
    <React.Fragment>
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
    </React.Fragment>
  );

  renderLeftPanel = (canvases, selectedCanvas, paintingAnnotations, selectedAnnotation, lang) => {
    const leftPanelComponents = this.renderLeftPanelComponents(canvases, selectedCanvas, paintingAnnotations, selectedAnnotation, lang);
    if (leftPanelComponents) {
      return (
        <Layout.Left>
          {leftPanelComponents}
        </Layout.Left>
      );
    }
  };

  renderLeftPanelComponents = (canvases, selectedCanvas, paintingAnnotations, selectedAnnotation, lang) => (
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
  );

  renderCentrePanel = (canvases, selectedCanvas, paintingAnnotations, selectedAnnotation, lang) => {
    const centrePanelComponents = this.renderCentrePanelComponents(canvases, selectedCanvas, paintingAnnotations, selectedAnnotation, lang);
    if (centrePanelComponents) {
      return (
        <Layout.Center>
          {centrePanelComponents}
        </Layout.Center>
      );
    }
  };
  

  renderCentrePanelComponents = (canvases, selectedCanvas, paintingAnnotations, selectedAnnotation, lang) => (
    <EditableCanvasPanel
      canvas={selectedCanvas}
      resources={this.state.resources}
      selectedAnnotation={this.state.selectedIdsByType.Annotation}
      select={this.selectResource}
      update={this.updateProperty}
      getResource={this.getResource}
    />
  )

  renderRightPanel = (canvases, selectedCanvas, paintingAnnotations, selectedAnnotation, lang) => {
    const rightPanelComponents = this.renderRightPanelComponents(canvases, selectedCanvas, paintingAnnotations, selectedAnnotation, lang);
    if (rightPanelComponents) {
      return (
        <Layout.Right>
          {rightPanelComponents}
        </Layout.Right>
      );
    }
  };

  renderRightPanelComponents = (canvases, selectedCanvas, paintingAnnotations, selectedAnnotation, lang) => (
    <TabPanel>
      <Properties
        resources={this.state.resources}
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
  )

  renderBottomPanel = (canvases, selectedCanvas, paintingAnnotations, selectedAnnotation, lang) => {
    const bottomPanelComponents = this.renderBottomPanelComponents(canvases, selectedCanvas, paintingAnnotations, selectedAnnotation, lang);
    if (bottomPanelComponents) {
      return (
        <Layout.Bottom>
          {bottomPanelComponents}
        </Layout.Bottom>
      );
    }
  }

  renderBottomPanelComponents = (canvases, selectedCanvas, paintingAnnotations, selectedAnnotation, lang) => (
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
  )

  renderDialogs = (canvases, selectedCanvas, paintingAnnotations, selectedAnnotation, lang) => 
    this.dialogs.map(dialog => dialog.renderer(canvases, selectedCanvas, paintingAnnotations, selectedAnnotation, lang));

  renderSourcePreviewDialog = () => (
    <SourcePreviewDialog
      json={this.state.jsonSnapshot}
      open={this.state.previewDialogOpen}
      handleClose={this.togglePreviewDialog}
    />
  );
  renderDefaultLoadManifestDialog = () => (
    <DefaultLoadManifestDialog
      open={this.state.loadManifestDialogOpen}
      loadManifest={this.loadManifest}
      handleClose={this.toggleManifestDialog}
    />
  );

  getCanvases = () => 
    this.state.rootResource
    ? this.state.resources[this.state.rootResource].items
    : [];

  getSelectedCanvas = () => 
    this.state.selectedIdsByType.Canvas
      ? this.state.resources[this.state.selectedIdsByType.Canvas] || null
      : null;

  getPaintingAnnotations = (canvas) => 
    canvas && canvas.items && canvas.items.length > 0
      ? this.state.resources[canvas.items[0]].items || null
      : null;
  
  getSelectedAnnotation = () => 
    this.state.selectedIdsByType.Annotation
    ? this.state.resources[this.state.selectedIdsByType.Annotation] || null
    : null;

  getConfig = () => {
    return [
      'config', 
      'annotation', 
      'translation', 
      'dragDrop', 
      'behavior', 
      'annotationFormButtons', 
      'propertyFields',
      'iiifResourceDefaults',
      'propertyPanel'
    ].reduce(
        (extraconfs, property) => {
          if (this.props[property]) {
            extraconfs[property] = this.props[property]
          }
          return extraconfs;
        }, {});
  };

  render() {
    const canvases = this.getCanvases();
    const selectedCanvas = this.getSelectedCanvas();
    const paintingAnnotations = this.getPaintingAnnotations(selectedCanvas);
    const selectedAnnotation = this.getSelectedAnnotation();
    const { lang } = this.state;
    
    return (
      <MuiThemeProvider theme={this.props.theme}>
        <ManifestEditor
          invokeAction={this.invokeAction2}
          {...this.getConfig()}
        >
          <Layout>
            <AppBar>
              {this.renderAppBarButtons()}
            </AppBar>
            <Layout.Middle>
              <Layout.MiddleContent>
                {this.renderLeftPanel(canvases, selectedCanvas, paintingAnnotations, selectedAnnotation, lang)}
                {this.renderCentrePanel(canvases, selectedCanvas, paintingAnnotations, selectedAnnotation, lang)}
                {this.renderRightPanel(canvases, selectedCanvas, paintingAnnotations, selectedAnnotation, lang)}
              </Layout.MiddleContent>
            </Layout.Middle>
            {this.renderBottomPanel(canvases, selectedCanvas, paintingAnnotations, selectedAnnotation, lang)}
          </Layout>
        </ManifestEditor>
        {this.renderDialogs(canvases, selectedCanvas, paintingAnnotations, selectedAnnotation, lang)}
      </MuiThemeProvider>
    );
  }
}

ManifestEditorApp.propTypes = {
  theme: PropTypes.any,
};

export default ManifestEditorApp;
