import React from 'react';
import * as classnames from 'classnames';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import {
  LibraryAdd,
  SaveAlt,
  Visibility,
  GridOn,
  GridOff,
  Input,
} from '@material-ui/icons';

// import ExhibitionPreview from '../components/ExhibitionPreview';
// import ExhibitionCanvasWidthHeight from '../components/ExhibitionCanvasWidthHeight';
// import {
//   AppBarButton,
//   TabPanel,
//   AnnotationList,
//   EditableCanvasPanel,
//   AnnotationList,
//   CanvasList
//   TextPainting,
//   TextLayoutViewFocus,
//   ImagePainting,
//   VideoPainting,
// } from '@iiif-mec/core';
import AppBarButton from '../components/AppBarButton/AppBarButton';
import TabPanel from '../components/TabPanel/TabPanel';
// import AnnotationList from '../components/AnnotationList/AnnotationList';
// import CanvasList from '../components/CanvasList/CanvasList';
// import EditableCanvasPanel from '../components/EditableCanvasPanel/EditableCanvasPanel';
import TextPainting from '../annotation/TextPainting';
import TextLayoutViewFocus from '../annotation/TextLayoutViewFocus';
import ImagePainting from '../annotation/ImagePainting';
import VideoPainting from '../annotation/VideoPainting';

import ExhibitionPreview from './TUDelftManifestEditor.ExhibitionPreview';
import ExhibitionCanvasWidthHeight from './TUDelftManifestEditor.ExhibitionCanvasWidthHeight';

import './TUDelftManifestEditor.scss';
import ManifestEditorApp from './ManifestEditorApp';


// Temporary override until the settings panel hasn't been funded.
window.rootManifestUrl =
  'https://delft-static-site-generator.netlify.com/iiif/';

class TUDelftManifestEditor extends ManifestEditorApp {
  getConfig = () => ({
    config: {
      s3: {
        AMZN_S3_IDENTITY_POOL_HASH:
          '23b9d884-95a2-4d5c-8a38-e847db51217e',
        AMZN_S3_REGION: 'eu-west-1',
        AMZN_S3_BUCKET: 'dlcservices-delft-pre-ingest-uploads',
      },
      hideHeaderForSingleTab: true,
    },
    annotation: {
      'TextualBody::layout-viewport-focus': TextLayoutViewFocus,
      'TextualBody::painting': TextPainting,
      'Image::painting': ImagePainting,
      'Video::painting': VideoPainting,
    },
    translation: {
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
    },
    behavior: this.state.exhibitionMode && {
      Canvas: {
        groups: [
          ['row', 'column', 'info'],
          props => <ExhibitionCanvasWidthHeight {...props} />,
          ['caption-left'],
        ],
      },
    }
  });

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
    return (
      <div
        className={classnames('tu-delft-manifest-editor', {
          'tu-delft-manifest-editor--exhibition-mode': this.state.exhibitionMode,
          'tu-delft-manifest-editor--exhibition-full-view': this.state.exhibitionFullView,
        })}
      >
        {super.render()}
      </div>   
    )
  }

  renderAppBarButtons = () => (
    <React.Fragment>
      <AppBarButton
        text="Load Manifest"
        onClick={this.toggleManifestDialog}
        icon={<Input />}
      />
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
        text="Exhibition/Standard"
        onClick={this.toggleExhibitionMode}
        icon={this.state.exhibitionMode ? <GridOn /> : <GridOff />}
      />
    </React.Fragment>
  );

  renderDelftLeftPanel = ({canvases, selectedCanvas, paintingAnnotations, selectedAnnotation, lang}) => (
    <TabPanel>
      {this.renderAnnotationList(canvases, selectedCanvas, paintingAnnotations, selectedAnnotation, lang)}
      {this.state.exhibitionMode && (
        <ExhibitionPreview
          title="Exhibition Preview"
          getResource={this.getResource}
          resources={this.state.resources}
          canvases={canvases}
          manifest={this.state.resources[this.state.rootResource]}
          direction="vertical"
          lang={lang}
          selected={this.state.selectedIdsByType.Canvas}
          select={this.selectResource}
          remove={this.deleteResource}
          invokeAction={this.invokeAction}
          toggleZoom={this.toggleExhibitionFullView}
        />
      )}
    </TabPanel>
  );

  renderLeftPanelComponents = (panelProps) => 
    !(this.state.exhibitionMode && this.state.exhibitionFullView) && this.renderDelftLeftPanel(panelProps);

  renderCentrePanelComponents = (panelProps) => 
    !(this.state.exhibitionMode && this.state.exhibitionFullView) 
      ? this.renderCanvasEditor(panelProps)
      : this.renderDelftLeftPanel(panelProps);
  
  renderBottomPanelComponents = (panelProps) =>
    !this.state.exhibitionMode && this.renderCanvasList(panelProps)
}

export default TUDelftManifestEditor;