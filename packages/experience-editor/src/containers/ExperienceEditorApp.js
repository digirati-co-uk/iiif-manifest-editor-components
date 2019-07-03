import * as React from 'react';
import * as PropTypes from 'prop-types';

import { LibraryAdd, SaveAlt, Visibility } from '@material-ui/icons';
import { AppBarButton, ManifestEditorApp, saveResource, IIIFReducer } from '@iiif-mec/core';

import EditorModeSelector from '../components/EditorModeSelector';
import LoadManifestModal from '../components/LoadManifestModal';
import SaveManifestModal from '../components/SaveManifestModal';
import PreviewModal from '../components/Preview/PreviewModal';
import SlideEditor from '../components/SlideEditor';
import configs from '../defaults';
import LoadIcon from '../components/LoadIcon';
import SaveIcon from '../components/SaveIcon';


class ExperienceEditorApp extends ManifestEditorApp {
  constructor(props) {
    super(props);
    this.modalDefinitions = [{
      renderer: this.renderSourcePreviewDialog,
      openState: 'previewDialogOpen'
    }, {
      renderer: this.renderLoadManifestDialog,
      openState: 'loadManifestDialogOpen'
    }, {
      renderer: this.renderSaveManifestDialog,
      openState: 'saveManifestDialogOpen'
    }, {
      renderer: this.renderPreviewDialog,
      openState: 'previewInContextDialogOpen'
    }];
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.onUnload);
  }
  
  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onUnload);
  }

  buildAppBarProps = () => ({
    titleComponent: (
      <EditorModeSelector
        selected={this.state.editorMode}
        onSelect={this.setEditorMode}
      />
    )
  });

  setUpDialogComponents = () => {
    this.dialogs = [{
      renderer: this.renderSourcePreviewDialog,
      openState: 'previewDialogOpen'
    }, {
      renderer: this.renderDefaultLoadManifestDialog,
      openState: 'loadManifestDialogOpen'
    }];
  };

  getConfig = () => ({
    config: {
      appBarButtonStyle: 'icon-and-label',
      hideHeaderForSingleTab: true,
    },
    ...configs[this.state.editorMode || 'default']
  });

  newProject = () => {
    if ((window.lastPersist || 0) < window.lastOperation) {
      if (
        !window.confirm(
          `Your project hasn't been saved, would you like to continue`
        )
      ) {
        return;
      }
    }
    this.dispatch(IIIFReducer, {
      type: 'LOAD_MANIFEST',
      manifest: this.newManifest(),
    });
  };
  
  onUnload = ev => {
    // the method that will be used for both add and remove event
    const result = (window.lastPersist || 0) < window.lastOperation;
    if (result) {
      ev.returnValue = result;
      return result;
    } else {
      ev.preventDefault();
    }
  };

  renderAppBarButtons = () => (
    <React.Fragment>
      <AppBarButton
        text="New"
        onClick={this.newProject}
        icon={<LibraryAdd />}
      />
      <AppBarButton
        text="Load"
        onClick={this.toggleLoadManifestDialog}
        icon={<LoadIcon />}
      />
      <AppBarButton
        text="Save"
        onClick={this.toggleSaveManifestDialog}
        icon={<SaveIcon />}
      />
      <AppBarButton
        text="Download"
        onClick={this.saveProject}
        icon={<SaveAlt />}
      />
      {this.state.editorMode === 'default' && (
        <AppBarButton
          text="Preview JSON"
          onClick={this.togglePreviewDialog}
          icon={<Visibility />}
        />
      )}
      <AppBarButton
        text="Preview"
        onClick={this.toggleItemPreview}
        icon={<Visibility />}
      />
    </React.Fragment>
  );

  setEditorMode = (ev, selectedElement) => {
    this.setState(
      {
        editorMode: selectedElement.props.value,
      },
      () => {
        const manifest = this.state.resources[this.state.rootResource];
        const behaviours = (manifest.behavior || []).filter(
          item => item !== 'slideshow' && item !== 'annotated-zoom'
        );
        if (selectedElement.props.value !== 'default') {
          behaviours.push(selectedElement.props.value);
        }
        this.updateProperty(
          manifest,
          'behavior',
          null,
          behaviours
        );
      }
    );
  };

  renderCentrePanelComponents = (panelProps) => 
    this.state.editorMode === 'slideshow' &&
      (!panelProps.selectedAnnotation || 
        (panelProps.selectedAnnotation && panelProps.selectedAnnotation.motivation !== 'layout-viewport-focus')) 
      ? (
        <SlideEditor
          selectedCanvas={panelProps.selectedCanvas} 
          resources={this.state.resources}
        />
      ) 
      : this.renderCanvasEditor(panelProps);

  renderBottomPanelComponents = (panelProps) => 
    this.state.editorMode !== 'annotated-zoom' && 
    this.renderCanvasList(panelProps);

  
  toggleLoadManifestDialog = () => {
    this.setState({
      loadManifestDialogOpen: !this.state.loadManifestDialogOpen,
    });
  };

  renderLoadManifestDialog = () => (
    <LoadManifestModal
      key={'LoadManifestDialog'}
      collectionURL={'https://iiif-collection.ch.digtest.co.uk/p3/'}
      open={this.state.loadManifestDialogOpen}
      loadManifest={this.loadManifest}
      handleClose={this.toggleLoadManifestDialog}
    />
  );

  toggleSaveManifestDialog = () => {
    this.setState({
      saveManifestDialogOpen: !this.state.saveManifestDialogOpen,
    });
  };

  renderSaveManifestDialog = () => {
    const { resources, rootResource, saveManifestDialogOpen } = this.state;
    return saveManifestDialogOpen && (
      <SaveManifestModal
        manifest={saveResource(rootResource, resources)} 
        open={saveManifestDialogOpen}
        handleClose={this.toggleSaveManifestDialog}
        regenerateIds={this.regenerateIds}
        //enqueueSnackbar={enqueueSnackbar}
      />
    );
  };

  toggleItemPreview = () => {
    this.setState({
      previewInContextDialogOpen: !this.state.previewInContextDialogOpen,
    });
  };


  renderPreviewDialog = () => {
    const { resources, rootResource, previewInContextDialogOpen } = this.state;
    return previewInContextDialogOpen && (
      <PreviewModal
        manifest={saveResource(rootResource, resources)} 
        open={previewInContextDialogOpen}
        handleClose={this.toggleItemPreview}
      />
    );
  };
};

export default ExperienceEditorApp;