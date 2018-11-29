import generateURI from './URIGenerator';

const defaultResourceRenderers = {
  Manifest: props => ({
    '@context': [
      'http://www.w3.org/ns/anno.jsonld',
      'http://iiif.io/api/presentation/3/context.json',
    ],
    type: 'Manifest',
    label: {
      label: {
        en: ['Untitled Manifest'],
      },
    },
    items: [],
    ...props,
  }),
  Canvas: props => ({
    label: {
      en: ['Untitled Canvas'],
    },
    height: 1000,
    width: 1000,
    type: 'Canvas',
    items: [
      {
        type: 'AnnotationPage',
        items: [],
      },
    ],
    ...props,
  }),
  Annotation: props => ({
    type: 'Annotation',
    motivation: 'painting',
    label: {
      en: ['Untitled Annotation'],
    },
    body: {
      type: 'TextualBody',
      value: 'Untitled Annotation Body',
      format: 'text/plain',
    },
    ...props,
  }),
};

/**
 * Renders the resource template using the passed properties.
 *
 * Two ways to define renderers:
 * - simple nunjucks json templates.
 * - template functions
 * @param {String} type - This is the IIIF resource type
 * @param {Object} options - parameters for the renderer
 */
const renderResource = (type, options = { props: {} }) => {
  let resource;
  //TODO: make it overridable
  if (defaultResourceRenderers.hasOwnProperty(type)) {
    resource = defaultResourceRenderers[type](options.props);
  } else {
    resource = {
      type,
    };
  }
  generateURI(resource, options.parent);
  return resource;
};

export default renderResource;
