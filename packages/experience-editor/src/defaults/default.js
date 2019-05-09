import { ImagePainting, TextLayoutViewFocus, TextualBodyDescribing } from '@iiif-mec/core';

export default {
  annotation: {
    'Image::painting': ImagePainting,
    'TextualBody::describing': TextualBodyDescribing,
    'TextualBody::layout-viewport-focus': TextLayoutViewFocus,
  },
  metaOntology: {},
  behavior: {},
  annotationFormButtons: {
    NewAnnotationForm: ['dismiss', 'fitCanvasToContent'],
    'TextualBodyDescribing.NewAnnotationForm': [
      'dismiss',
      'fitContentToCanvas',
    ],
    'TextLayoutViewFocus.NewAnnotationForm': ['dismiss', 'fitContentToCanvas'],
  },
  propertyFields: null,
  iiifResourceDefaults: {},
  propertyPanel: {
    selectionType: 'accordion',
    selectionVisibility: {
      null: ['Manifest'],
      Canvas: ['Canvas', 'Manifest'],
      Annotation: ['Annotation', 'Canvas', 'Manifest'],
    },
  },
};
