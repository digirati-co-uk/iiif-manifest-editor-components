import React from 'react';
import PropTypes from 'prop-types';
import langs from 'langs';
import deepmerge from 'deepmerge';

import IIIFReducer from '../../reducers/iiif';

import TextPainting from '../../annotation/TextPainting';
import ImagePainting from '../../annotation/ImagePainting';
import VideoPainting from '../../annotation/VideoPainting';
import AudioPainting from '../../annotation/AudioPainting';
import { getCanvasFromExternalManifest } from '../../utils/IIIFResource';
import generateURI from '../../utils/URIGenerator';

const getImageInfoURL = dlcsURL => {
  return (
    dlcsURL
      .replace('api.', '')
      .replace('/customers/', '/thumbs/')
      .replace('/spaces/', '/')
      .replace('/images/', '/') + '/info.json'
  );
};

const defaultEditorContext = {
  annotation: {
    'TextualBody::painting': TextPainting,
    'Image::painting': ImagePainting,
    'Video::painting': VideoPainting,
    'Audio::painting': AudioPainting,
  },
  dragDrop: {
    'canvaslist->canvaslist': ({ dispatch }, drop) => {
      dispatch(IIIFReducer, {
        type: 'UPDATE_RESOURCE_ORDER',
        options: {
          id: drop.draggableId,
          startIndex: drop.source.index,
          targetIndex: drop.destination.index,
        },
      });
    },
    'annotationlist->annotationlist': ({ dispatch }, drop) => {
      dispatch(IIIFReducer, {
        type: 'UPDATE_RESOURCE_ORDER',
        options: {
          id: drop.draggableId,
          startIndex: drop.source.index,
          targetIndex: drop.destination.index,
        },
      });
    },
    'dlcsimagelist->annotationlist': ({ state, dispatch }, drop) => {
      if (window.draggedData) {
        const serviceUrl = getImageInfoURL(window.draggedData['@id']);
        //TODO: dlcs video
        const annotation = {
          motivation: 'painting',
          type: 'Annotation',
          body: {
            id:
              serviceUrl.replace('/info.json', '') + '/full/full/0/default.jpg',
            type: 'Image',
            format: 'image/jpeg',
            height: window.draggedData.height,
            width: window.draggedData.width,
            label: {
              en: ['-'],
            },
            service: {
              id: serviceUrl,
              type: 'ImageService2',
            },
          },
          thumbnail: [
            {
              id:
                serviceUrl
                  .replace('/iiif-img/', '/thumbs/')
                  .replace('/info.json', '') + '/full/full/0/default.jpg',
              type: 'Image',
              service: {
                id: serviceUrl.replace('/iiif-img/', '/thumbs/'),
              },
            },
          ],
        };
        generateURI(annotation, state.selectedIdsByType.Canvas);
        annotation.target = state.selectedIdsByType.Canvas;
        dispatch(IIIFReducer, {
          type: 'ADD_SPECIFIC_RESOURCE',
          options: {
            props: annotation,
            parent: state.selectedIdsByType.Canvas,
            index: drop.destination.index,
          },
        });
      }
    },
    'dlcsimagelist->canvaseditor': ({ state, dispatch }, drop) => {
      if (window.draggedData) {
        const serviceUrl = getImageInfoURL(window.draggedData['@id']);
        //TODO: dlcs video
        const annotation = {
          motivation: 'painting',
          type: 'Annotation',
          body: {
            id:
              serviceUrl.replace('/info.json', '') + '/full/full/0/default.jpg',
            type: 'Image',
            format: 'image/jpeg',
            height: window.draggedData.height,
            width: window.draggedData.width,
            label: {
              en: ['-'],
            },
            service: {
              id: serviceUrl,
              type: 'ImageService2',
            },
          },
          thumbnail: [
            {
              id:
                serviceUrl
                  .replace('/iiif-img/', '/thumbs/')
                  .replace('/info.json', '') + '/full/full/0/default.jpg',
              type: 'Image',
              service: {
                id: serviceUrl.replace('/iiif-img/', '/thumbs/'),
              },
            },
          ],
        };
        generateURI(annotation, state.selectedIdsByType.Canvas);
        annotation.target = state.selectedIdsByType.Canvas;
        dispatch(IIIFReducer, {
          type: 'ADD_SPECIFIC_RESOURCE',
          options: {
            props: annotation,
            parent: state.selectedIdsByType.Canvas,
            //index: drop.destination.index,
          },
        });
      }
    },
    'dlcsimagelist->canvaslist': ({ state, dispatch }, drop) => {
      if (window.draggedData) {
        const serviceUrl = getImageInfoURL(window.draggedData['@id']);
        //TODO: dlcs video
        const canvas = {
          label: {
            en: ['Untitled Canvas'],
          },
          height: window.draggedData.height,
          width: window.draggedData.width,
          type: 'Canvas',
          items: [
            {
              type: 'AnnotationPage',
              items: [
                {
                  motivation: 'painting',
                  type: 'Annotation',
                  body: {
                    id:
                      serviceUrl.replace('/info.json', '') +
                      '/full/full/0/default.jpg',
                    type: 'Image',
                    format: 'image/jpeg',
                    height: window.draggedData.height,
                    width: window.draggedData.width,
                    label: {
                      en: ['-'],
                    },
                    service: {
                      id: serviceUrl,
                      type: 'ImageService2',
                    },
                  },
                  thumbnail: [
                    {
                      id:
                        serviceUrl
                          .replace('/iiif-img/', '/thumbs/')
                          .replace('/info.json', '') +
                        '/full/full/0/default.jpg',
                      type: 'Image',
                      service: {
                        id: serviceUrl.replace('/iiif-img/', '/thumbs/'),
                      },
                    },
                  ],
                },
              ],
            },
          ],
        };
        generateURI(canvas, state.rootResource.id);
        generateURI(canvas.items[0], canvas.id);
        generateURI(canvas.items[0].items[0], canvas.id);
        canvas.items[0].items[0].target = canvas.id;
        dispatch(IIIFReducer, {
          type: 'ADD_SPECIFIC_RESOURCE',
          options: {
            props: canvas,
            parent: state.rootResource.id,
            index: drop.destination.index,
          },
        });
      }
    },
    'iiifimagelist->canvaslist': ({ state, dispatch }, drop) => {
      if (window.draggedData) {
        const canvas = window.draggedData;
        if (canvas.width) {
          canvas.width = parseInt(canvas.width, 10) || 0;
        }
        if (canvas.height) {
          canvas.height = parseInt(canvas.height, 10) || 0;
        }
        generateURI(canvas, state.rootResource.id);
        if (canvas.items && canvas.items.length) {
          canvas.items.forEach(annotationPage => {
            generateURI(annotationPage, canvas.id);
            if (annotationPage.items) {
              annotationPage.items.forEach(annotation => {
                generateURI(annotation, annotationPage.id);
                if (annotation.body) {
                  if (annotation.body.width) {
                    annotation.body.width =
                      parseInt(annotation.body.width, 10) || 0;
                  }
                  if (annotation.body.height) {
                    annotation.body.height =
                      parseInt(annotation.body.height, 10) || 0;
                  }
                }
                if (annotation.target) {
                  const [originalCanvas, hash] = annotation.target.split('#');
                  annotation.target = canvas.id + (hash ? `#${hash}` : '');
                }
              });
            }
          });
        }
        if (canvas.annotations && canvas.annotations.length) {
          canvas.annotations.forEach(annotationPage => {
            generateURI(annotationPage, canvas.id);
            if (annotationPage.items) {
              annotationPage.items.forEach(annotation => {
                generateURI(annotation, annotationPage.id);
                if (annotation.target) {
                  const [originalCanvas, hash] = annotation.target.split('#');
                  annotation.target = canvas.id + (hash ? `#${hash}` : '');
                } else {
                  annotation.target = canvas.id;
                }
              });
            }
          });
        }
        dispatch(IIIFReducer, {
          type: 'ADD_SPECIFIC_RESOURCE',
          options: {
            props: canvas,
            parent: state.rootResource.id,
            index: drop.destination.index,
          },
        });
      }
    },
    'iiifimagelist->annotationlist': ({ state, dispatch }, drop) => {
      const [manifestId, canvasId] = drop.draggableId.split('||||');
      if (window.draggedData) {
        const canvas = window.draggedData;
        if (canvas.items && canvas.items.length) {
          canvas.items.forEach(annotationPage => {
            if (annotationPage.items) {
              annotationPage.items.forEach((annotation, index) => {
                generateURI(annotation, annotationPage.id);
                if (annotation.target) {
                  const [originalCanvas, hash] = annotation.target.split('#');
                  annotation.target =
                    state.selectedIdsByType.Canvas + (hash ? `#${hash}` : '');
                } else {
                  annotation.target = state.selectedIdsByType.Canvas;
                }
                dispatch(IIIFReducer, {
                  type: 'ADD_SPECIFIC_RESOURCE',
                  options: {
                    props: annotation,
                    parent: state.selectedIdsByType.Canvas,
                    index: drop.destination.index + index,
                  },
                });
              });
            }
          });
        }
      }
    },
    'iiifimagelist->canvaseditor': ({ state, dispatch }, drop) => {
      if (window.draggedData) {
        const canvas = window.draggedData;
        if (canvas.items && canvas.items.length) {
          canvas.items.forEach(annotationPage => {
            if (annotationPage.items) {
              annotationPage.items.forEach((annotation, index) => {
                generateURI(annotation, annotationPage.id);
                if (annotation.target) {
                  const [originalCanvas, hash] = annotation.target.split('#');
                  annotation.target =
                    state.selectedIdsByType.Canvas + (hash ? `#${hash}` : '');
                } else {
                  annotation.target = state.selectedIdsByType.Canvas;
                }
                dispatch(IIIFReducer, {
                  type: 'ADD_SPECIFIC_RESOURCE',
                  options: {
                    props: annotation,
                    parent: state.selectedIdsByType.Canvas,
                  },
                });
              });
            }
          });
        }
      }
    },
  },
  behavior: {},
  translation: {
    languages: langs.all(),
    defaultLanguage: 'en',
  },
};

const EditorContext = React.createContext(defaultEditorContext);
export class EditorProvider extends React.Component {
  render() {
    const {
      children,
      configuration,
      annotation,
      translation,
      dragDrop,
      behavior,
    } = this.props;

    const aggregatedConfig = deepmerge.all([
      defaultEditorContext,
      configuration,
    ]);
    if (annotation) {
      aggregatedConfig.annotation = annotation;
    }
    if (translation) {
      aggregatedConfig.translation = translation;
    }
    if (dragDrop) {
      aggregatedConfig.dragDrop = dragDrop;
    }
    if (behavior) {
      aggregatedConfig.behavior = behavior;
    }

    return (
      <EditorContext.Provider value={aggregatedConfig}>
        {children}
      </EditorContext.Provider>
    );
  }
}

EditorProvider.propTypes = {
  /** child components of the provider */
  children: PropTypes.any,
  /** config to merge */
  configuration: PropTypes.object,
  /** annotation configuration override (replaces the default) */
  annotation: PropTypes.object,
  /** translation configuration override (replaces the default)  */
  translation: PropTypes.object,
  /** Drag and drop configuration override (replaces the default) */
  dragDrop: PropTypes.object,
  /** Behaviour definitions */
  behavior: PropTypes.object,
};

EditorProvider.defaultProps = {
  configuration: {},
  annotation: null,
  translation: null,
  dragDrop: null,
  behavior: null,
};

export const EditorConsumer = EditorContext.Consumer;
