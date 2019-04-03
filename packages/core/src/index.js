import * as React from 'react';
import { render } from 'react-dom';
import SimpleEditorUI from './containers/SimpleEditorUI';
render(<SimpleEditorUI />, document.getElementById('app'));
//import TUDelftManifestEditor from './containers/TUDelftManifestEditor';
//render(<TUDelftManifestEditor />, document.getElementById('app'));
//import VNASlideshowEditor from './containers/VNASlideshowEditor';
//render(<VNASlideshowEditor />, document.getElementById('app'));

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
  queryResourceById,
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
export {
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
  queryResourceById,
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
