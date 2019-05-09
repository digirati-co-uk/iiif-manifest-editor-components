import * as React from 'react';
import { render } from 'react-dom';
// import SimpleEditorUI from './containers/SimpleEditorUI';
// render(<SimpleEditorUI />, document.getElementById('app'));
//import TUDelftManifestEditor from './containers/TUDelftManifestEditor';
//render(<TUDelftManifestEditor />, document.getElementById('app'));
//import VNASlideshowEditor from './containers/VNASlideshowEditor';
//render(<VNASlideshowEditor />, document.getElementById('app'));

// import { createMuiTheme } from '@material-ui/core';


// const theme = createMuiTheme({
//   palette: {
//     primary: {
//       main: '#1d1c73',
//       contrastText: '#fff',
//     },
//     secondary: {
//       main: '#fff',
//       contrastText: '#1d1c73',
//     },
//   },
//   typography: {
//     fontSize: 12,
//     useNextVariants: true,
//   },
//   mixins: {
//     toolbar: {
//       minHeight: 36,
//     },
//   },
// });

// import TUDelftManifestEditor from './containers/TUDelftManifestEditor';
// render(
//   <TUDelftManifestEditor theme={theme} />, document.getElementById('app')
// );


import {
  // TOP LEVEL Components
  ManifestEditor,
  ManifestEditorAppBar,
  EditorConsumer,
  EditorProvider,
  // editor panels
  CanvasList,
  AnnotationList,
  EditableCanvas,
  EditableCanvasPanel,
  DLCSPanel,
  IIIFCollectionExplorer,
  Properties,
  // basic components
  AppBarButton,
  ApplicationLayout,
  ButtonWithTooltip,
  DefaultTooltip,
  Panel,
  TabPanel,
  //Translation/customisation
  LabelProvider,
  LabelConsumer,
  Label,
  LocaleString,
  // mostly internal components
  ImageCropper,
  MetadataEditor,
  NewAnnotationDialog,
  NotSupportedAnnotation,
  AnnotationBodyRenderer,
  SourcePreviewDialog,
  DefaultLoadManifestDialog,
} from './components';
import {
  ImagePainting,
  TextPainting,
  VideoPainting,
  AudioPainting,
  TextLayoutViewFocus,
  BaseAnnotation,
  AudioPropertiesForm,
  ImagePropertiesForm,
  TextPropertiesForm,
  VideoPropertiesForm,
  TextualBodyDescribing,
  FormStyles,
} from './annotation';
import {
  //download
  download,
  // resource
  renderResource,
  locale,
  update,
  getAnnotationDimensions,
  updateWithMeta,
  updateDisplayProperties,
  getW3cAnnotationStyle,
  getBounds,
  makeURLHash,
  getHashParams,
  getPath,
  getParentByChildId,
  // IIIF upgrader
  convertToV3ifNecessary,
  // generate uri
  generateURI,
  // parse video
  parseVideo,
  addResource,
} from './utils';
import IIIFReducer from './reducers/iiif';
import EditorReducer from './reducers/editor';
import { SIZING_STRATEGY } from './constants/sizing';
import ManifestEditorApp from './containers/ManifestEditorApp';
// import ExperienceEditorApp from './containers/ExperienceEditorApp';

// const theme = createMuiTheme({
//   palette: {
//     primary: {
//       main: '#59bfec',
//       contrastText: '#fff',
//     },
//     secondary: {
//       main: '#fff',
//       contrastText: '#59bfec',
//     },
//   },
//   typography: {
//     fontSize: 12,
//     useNextVariants: true,
//   },
//   mixins: {
//     toolbar: {
//       minHeight: 36,
//     },
//   },
// });

// render(
//   <ManifestEditorApp 
//     theme={theme}
//     config={{
//       s3: {
//         AMZN_S3_IDENTITY_POOL_HASH:
//           '4ef2005b-0ce9-40f9-9e24-b5d50e72c0f1',
//         AMZN_S3_REGION: 'eu-west-1',
//         AMZN_S3_BUCKET: 'dlcs-dlcservices-test-ingest',
//       },
//     }}
//   />, document.getElementById('app'));

// render(
//   <ExperienceEditorApp 
//     theme={theme}
//   />, document.getElementById('app'));

export {
  ManifestEditorApp,
  // Components
  // TOP LEVEL Components
  ManifestEditor,
  ManifestEditorAppBar,
  EditorConsumer,
  EditorProvider,
  // editor panels
  CanvasList,
  AnnotationList,
  EditableCanvas,
  EditableCanvasPanel,
  DLCSPanel,
  IIIFCollectionExplorer,
  Properties,
  // basic components
  AppBarButton,
  ApplicationLayout,
  ButtonWithTooltip,
  DefaultTooltip,
  Panel,
  TabPanel,
  //Translation/customisation
  LabelProvider,
  LabelConsumer,
  Label,
  LocaleString,
  // mostly internal components
  ImageCropper,
  MetadataEditor,
  NewAnnotationDialog,
  NotSupportedAnnotation,
  AnnotationBodyRenderer,
  SourcePreviewDialog,
  DefaultLoadManifestDialog,
  //...annotation,
  ImagePainting,
  TextPainting,
  VideoPainting,
  AudioPainting,
  TextLayoutViewFocus,
  BaseAnnotation,
  AudioPropertiesForm,
  ImagePropertiesForm,
  TextPropertiesForm,
  VideoPropertiesForm,
  TextualBodyDescribing,
  FormStyles,
  // reducers
  IIIFReducer,
  EditorReducer,
  //...utils,
  //download
  download,
  // resource
  renderResource,
  locale,
  update,
  getAnnotationDimensions,
  updateWithMeta,
  updateDisplayProperties,
  getW3cAnnotationStyle,
  getBounds,
  makeURLHash,
  getHashParams,
  getPath,
  getParentByChildId,
  // IIIF upgrader
  convertToV3ifNecessary,
  // generate uri
  generateURI,
  // parse video
  parseVideo,
  addResource,
  SIZING_STRATEGY,
};
