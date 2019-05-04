import download from './download';
import renderResource, {
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
} from './IIIFResource';
import convertToV3ifNecessary from './IIIFUpgrader';
import generateURI from './URIGenerator';
import { parseVideo } from './VideoServices';
import { addResource } from './addResource';
import {
  isCanvasChangedEditor,
  isCanvasChangedAnnotationList,
} from './changeDetection';

export {
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
  // Change detection
  isCanvasChangedEditor,
  isCanvasChangedAnnotationList,
};
