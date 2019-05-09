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
  appBarProps = {};

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
    this.setUpDialogComponents();
  }

  buildAppBarProps = () =>
    this.props.appBarProps || this.appBarProps;

  setUpDialogComponents = () => {
    this.modalDefinitions = [{
      renderer: this.renderSourcePreviewDialog,
      openState: 'previewDialogOpen'
    }, {
      renderer: this.renderDefaultLoadManifestDialog,
      openState: 'loadManifestDialogOpen'
    }];
  };

  changeLanguage = lang => {
    this.dispatch(EditorReducer, { type: 'CHANGE_LANGUAGE', lang });
  };

  resetPopupStates = () => 
    this.modalDefinitions.reduce((popupStates, dialog) => {
      popupStates[dialog.openState] = false;
      return popupStates;
    }, {});

  prepareAutoSave = () =>
    JSON.stringify(
      Object.assign(
        {}, 
        this.state, 
        this.resetPopupStates()
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

  regenerateIds = (manifestId, afterStateChange) => {
    this.dispatch(
      IIIFReducer,
      {
        type: 'REGENERATE_IDS',
        manifestId,
      },
      afterStateChange);
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

  addNewCanvas = () => {
    this.dispatch(IIIFReducer, {
      type: 'ADD_RESOURCE',
      options: {
        type: 'Canvas',
        parent: this.state.rootResource,
      },
    });
  }
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
      type: 'UPDATE_RESOURCE_PROPERTY',
      options: {
        target,
        property,
        lang,
        value,
      },
    }, afterStateChange);
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

  //----------------------------------------
  // Override this if for different buttons
  //----------------------------------------
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

  renderLeftPanel = (panelProps) => {
    const leftPanelComponents = this.renderLeftPanelComponents(panelProps);
    if (leftPanelComponents) {
      return (
        <Layout.Left>
          {leftPanelComponents}
        </Layout.Left>
      );
    }
  };

  renderCentrePanel = (panelProps) => {
    const centrePanelComponents = this.renderCentrePanelComponents(panelProps);
    if (centrePanelComponents) {
      return (
        <Layout.Center>
          {centrePanelComponents}
        </Layout.Center>
      );
    }
  };

  renderRightPanel = (panelProps) => {
    const rightPanelComponents = this.renderRightPanelComponents(panelProps);
    if (rightPanelComponents) {
      return (
        <Layout.Right>
          {rightPanelComponents}
        </Layout.Right>
      );
    }
  };


  renderBottomPanel = (panelProps) => {
    const bottomPanelComponents = this.renderBottomPanelComponents(panelProps);
    if (bottomPanelComponents) {
      return (
        <Layout.Bottom>
          {bottomPanelComponents}
        </Layout.Bottom>
      );
    }
  };

  //------------------------------------------------------------
  // Use these functions in the overridden panel layout 
  // functions below.
  //------------------------------------------------------------
  renderCanvasList = ({ canvases, selectedCanvas, lang }) => (
    <CanvasList
      canvas={selectedCanvas}
      canvases={canvases}
      lang={lang}
      selected={this.state.selectedIdsByType.Canvas}
      select={this.selectResource}
      remove={this.deleteResource}
      addNewCanvas={this.addNewCanvas}
      getResource={this.getResource}
    />
  );

  renderProperties = ({ selectedCanvas, selectedAnnotation, lang }) => (
    <Properties
      resources={this.state.resources}
      manifest={this.state.resources[this.state.rootResource]}
      canvas={selectedCanvas}
      annotation={selectedAnnotation}
      lang={lang}
      changeLanguage={this.changeLanguage}
      update={this.updateProperty}
    />
  );

  renderDlcsPanel = () => (
    <DLCSPanel title="DLCS" />
  )

  renderCollectionExplorer = () => (
    <IIIFCollectionExplorer title="IIIF Explorer" />
  )

  renderCanvasEditor = ({ selectedCanvas }) => (
    <EditableCanvasPanel
      canvas={selectedCanvas}
      resources={this.state.resources}
      selectedAnnotation={this.state.selectedIdsByType.Annotation}
      select={this.selectResource}
      update={this.updateProperty}
      getResource={this.getResource}
    />
  );

  renderAnnotationList = ({ paintingAnnotations, lang }) => (
    <AnnotationList
      title="Annotations"
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
  
  //------------------------------------------------------------
  // Override the following functions if you want to modify 
  // layout of the panels.
  //------------------------------------------------------------
  renderLeftPanelComponents = (panelProps) => 
    this.renderAnnotationList(panelProps);

  renderRightPanelComponents = (panelProps) => (
    <TabPanel>
      {this.renderProperties(panelProps)}
      {this.renderDlcsPanel(panelProps)}
      {this.renderCollectionExplorer(panelProps)}
    </TabPanel>
  );

  renderCentrePanelComponents = (panelProps) => 
    this.renderCanvasEditor(panelProps);

  renderBottomPanelComponents = (panelProps) => 
    this.renderCanvasList(panelProps);  

  
  /**
   * Unified dialog renderer
   */
  renderDialogs = (panelProps) => 
    this.modalDefinitions.map(dialog => dialog.renderer(panelProps));

  renderSourcePreviewDialog = () => (
    <SourcePreviewDialog
      key={'SourcePreviewDialog'}
      json={this.state.jsonSnapshot}
      open={this.state.previewDialogOpen}
      handleClose={this.togglePreviewDialog}
    />
  );

  renderDefaultLoadManifestDialog = () => (
    <DefaultLoadManifestDialog
      key={'DefaultLoadManifestDialog'}
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
    const panelProps = {
      canvases,
      selectedCanvas,
      paintingAnnotations,
      selectedAnnotation,
      lang
    };
    const appBarProps = this.buildAppBarProps();
    return (
      <MuiThemeProvider theme={this.props.theme}>
        <ManifestEditor
          invokeAction={this.invokeAction2}
          {...this.getConfig()}
        >
          <Layout>
            <AppBar {...appBarProps}>
              {this.renderAppBarButtons()}
            </AppBar>
            <Layout.Middle>
              <Layout.MiddleContent>
                {this.renderLeftPanel(panelProps)}
                {this.renderCentrePanel(panelProps)}
                {this.renderRightPanel(panelProps)}
              </Layout.MiddleContent>
            </Layout.Middle>
            {this.renderBottomPanel(panelProps)}
          </Layout>
        </ManifestEditor>
        {this.renderDialogs(panelProps)}
      </MuiThemeProvider>
    );
  }
}

ManifestEditorApp.propTypes = {
  theme: PropTypes.any,
};

export default ManifestEditorApp;
