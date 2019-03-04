//import * as React from 'react';
//import { render } from 'react-dom';
// import SimpleEditorUI from './containers/SimpleEditorUI';
//render(<SimpleEditorUI />, document.getElementById('app'));
//import TUDelftManifestEditor from './containers/TUDelftManifestEditor';
//render(<TUDelftManifestEditor />, document.getElementById('app'));
//import VNASlideshowEditor from './containers/VNASlideshowEditor';
//render(<VNASlideshowEditor />, document.getElementById('app'));

import {
  // TOP LEVEL Components
  ManifestEditor,
  ManifestEditorAppBar,
  EditorContext,
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
  LabelContext,
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
} from './utils';
import IIIFReducer from './reducers/iiif';
import EditorReducer from './reducers/editor';

export {
  // Components
  // TOP LEVEL Components
  ManifestEditor,
  ManifestEditorAppBar,
  EditorContext,
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
  LabelContext,
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
};
