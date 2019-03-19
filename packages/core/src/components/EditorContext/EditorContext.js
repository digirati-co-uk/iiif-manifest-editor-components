import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as langs from 'langs';
import * as deepmerge from 'deepmerge';

import IIIFReducer from '../../reducers/iiif';

import TextPainting from '../../annotation/TextPainting';
import ImagePainting from '../../annotation/ImagePainting';
import VideoPainting from '../../annotation/VideoPainting';
import AudioPainting from '../../annotation/AudioPainting';
import generateURI from '../../utils/URIGenerator';
import { queryResourceById } from '../../utils/IIIFResource';

const getImageServiceURL = dlcsURL =>
  dlcsURL
    .replace('api.', '')
    .replace('/customers/', '/iiif-img/')
    .replace('/spaces/', '/')
    .replace('/images/', '/');

const getImageServiceInfoURL = serviceUrl => {
  const serviceUrlTrimmed = serviceUrl.replace(/\/$/, '');
  if (serviceUrlTrimmed.endsWith('/info.json')) {
    return serviceUrlTrimmed;
  } else {
    return `${serviceUrlTrimmed}/info.json`;
  }
};

const getImageAndThumbnailServiceInfo = (serviceUrl, thumbnailServiceURL) =>
  new Promise((resolve, reject) => {
    fetch(getImageServiceInfoURL(serviceUrl))
      .then(response => response.json())
      .then(imageServiceInfo => {
        if (!thumbnailServiceURL) {
          resolve({
            imageService: imageServiceInfo,
          });
        }
        fetch(getImageServiceInfoURL(thumbnailServiceURL))
          .then(response => response.json())
          .then(thumbnailServiceInfo => {
            resolve({
              imageService: imageServiceInfo,
              thumbnailService: thumbnailServiceInfo,
            });
          })
          .catch(msg => reject(msg));
      })
      .catch(msg => reject(msg));
  });

const IIIF_IMAGE_API_VERSION_MAPPING = {
  'http://library.stanford.edu/iiif/image-api/1.1/context.json': 1,
  'http://iiif.io/api/image/2/context.json': 2,
  'http://iiif.io/api/image/3/context.json': 3,
};

const transformServiceJson = service => {
  return Object.entries(service).reduce((transformed, [key, value]) => {
    if (key === '@id') {
      transformed.id = value;
    } else if (key === '@context') {
      transformed.type = `ImageService${IIIF_IMAGE_API_VERSION_MAPPING[value]}`;
    } else {
      transformed[key] = value;
    }
    return transformed;
  }, {});
};

const transformServices = services => {
  const { imageService, thumbnailService } = services;
  return {
    imageService: imageService ? transformServiceJson(imageService) : {},
    thumbnailService: thumbnailService
      ? transformServiceJson(thumbnailService)
      : {},
  };
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
        const serviceUrl = getImageServiceURL(window.draggedData['@id']);
        const thumbnailServiceURL = serviceUrl.replace(
          '/iiif-img/',
          '/thumbs/'
        );
        getImageAndThumbnailServiceInfo(serviceUrl, thumbnailServiceURL)
          .then(services => transformServices(services))
          .then(({ imageService, thumbnailService }) => {
            //TODO: dlcs video
            const annotation = {
              motivation: 'painting',
              type: 'Annotation',
              body: {
                id: `${serviceUrl}/full/full/0/default.jpg`,
                type: 'Image',
                format: 'image/jpeg',
                height: window.draggedData.height,
                width: window.draggedData.width,
                label: {
                  en: ['-'],
                },
                service: {
                  ...imageService,
                  id: serviceUrl,
                  type: 'ImageService2',
                },
              },
              thumbnail: [
                {
                  id: `${thumbnailServiceURL}/full/full/0/default.jpg`,
                  type: 'Image',
                  service: {
                    ...thumbnailService,
                    id: thumbnailServiceURL,
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
          });
      }
    },
    'dlcsimagelist->canvaseditor': ({ state, dispatch }, drop) => {
      if (window.draggedData) {
        const serviceUrl = getImageServiceURL(window.draggedData['@id']);
        const thumbnailServiceURL = serviceUrl.replace(
          '/iiif-img/',
          '/thumbs/'
        );
        getImageAndThumbnailServiceInfo(serviceUrl, thumbnailServiceURL)
          .then(services => transformServices(services))
          .then(({ imageService, thumbnailService }) => {
            //TODO: dlcs video
            const annotation = {
              motivation: 'painting',
              type: 'Annotation',
              body: {
                id: `${serviceUrl}/full/full/0/default.jpg`,
                type: 'Image',
                format: 'image/jpeg',
                height: window.draggedData.height,
                width: window.draggedData.width,
                label: {
                  en: ['-'],
                },
                service: {
                  ...imageService,
                  id: serviceUrl,
                  type: 'ImageService2',
                },
              },
              thumbnail: [
                {
                  id: `${thumbnailServiceURL}/full/full/0/default.jpg`,
                  type: 'Image',
                  service: {
                    ...thumbnailService,
                    id: thumbnailServiceURL,
                  },
                },
              ],
            };
            generateURI(annotation, state.selectedIdsByType.Canvas);
            const canvas = queryResourceById(
              state.selectedIdsByType.Canvas,
              state.rootResource
            );
            annotation.target = state.selectedIdsByType.Canvas;
            const imgWidth =
              imageService && imageService.width
                ? imageService.width
                : window.draggedData.width;
            const imgHeight =
              imageService && imageService.height
                ? imageService.height
                : window.draggedData.height;
            if (canvas.width < imgWidth || canvas.height < imgHeight) {
              const minRatio = Math.min(
                canvas.width / imgWidth,
                canvas.height / imgHeight
              );
              const tW = minRatio * imgWidth;
              const tH = minRatio * imgHeight;
              annotation.target += `#xywh=0,0,${tW},${tH}`;
            }

            dispatch(
              IIIFReducer,
              {
                type: 'ADD_SPECIFIC_RESOURCE',
                options: {
                  props: annotation,
                  parent: state.selectedIdsByType.Canvas,
                  //index: drop.destination.index,
                },
              },
              () => {
                // uncomment if we want this to behave like the canvas-list drag
                // dispatch(IIIFReducer, {
                //   type: 'UPDATE_RESOURCE',
                //   options: {
                //     id: state.selectedIdsByType.Canvas,
                //     props: {
                //       height:
                //         imageService && imageService.height
                //           ? imageService.height
                //           : window.draggedData.height,
                //       width:
                //         imageService && imageService.width
                //           ? imageService.width
                //           : window.draggedData.width,
                //     },
                //   },
                // });
              }
            );
          });
      }
    },
    'dlcsimagelist->canvaslist': ({ state, dispatch }, drop) => {
      if (window.draggedData) {
        const serviceUrl = getImageServiceURL(window.draggedData['@id']);
        const thumbnailServiceURL = serviceUrl.replace(
          '/iiif-img/',
          '/thumbs/'
        );
        getImageAndThumbnailServiceInfo(serviceUrl, thumbnailServiceURL)
          .then(services => transformServices(services))
          .then(({ imageService, thumbnailService }) => {
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
                        id: `${serviceUrl}/full/full/0/default.jpg`,
                        type: 'Image',
                        format: 'image/jpeg',
                        height: window.draggedData.height,
                        width: window.draggedData.width,
                        label: {
                          en: ['-'],
                        },
                        service: {
                          ...imageService,
                          id: serviceUrl,
                          type: 'ImageService2',
                        },
                      },
                      thumbnail: [
                        {
                          id: `${thumbnailServiceURL}/full/full/0/default.jpg`,
                          type: 'Image',
                          service: {
                            ...thumbnailService,
                            id: thumbnailServiceURL,
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
