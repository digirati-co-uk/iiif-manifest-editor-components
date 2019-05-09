import { ImagePainting, TextualBodyDescribing } from '@iiif-mec/core';

export default {
  annotation: {
    'Image::painting': ImagePainting,
    'TextualBody::describing': TextualBodyDescribing,
  },
  metaOntology: {
    'NewAnnotationForm.fitCanvasToContent': 'add',
    'NewAnnotationForm.fitContentToCanvas': 'add',
  },
  behavior: {},
  annotationFormButtons: {
    NewAnnotationForm: ['dismiss', 'fitCanvasToContent'],
    'TextualBodyDescribing.NewAnnotationForm': [
      'dismiss',
      'fitContentToCanvas',
    ],
  },
  propertyFields: {
    Manifest: [
      'label',
      'summary',
      'requiredStatement',
      'metadata',
      'navDate',
      'rights',
    ],
    Canvas: ['label'],
    Annotation: ['label', 'requiredStatement'],
    TextPropertiesForm: ['body.id', 'body.value'],
    ImagePropertiesForm: [
      'body.service.id',
      'body.id',
      'thumbnail.0.service.id',
      'thumbnail.0.id',
    ],
  },
  iiifResourceDefaults: {},
  propertyPanel: {
    selectionType: 'accordion',
    selectionVisibility: {
      null: ['Manifest'],
      Canvas: ['Manifest'],
      Annotation: ['Annotation', 'Manifest'],
    },
  },
};
