import generateURI from './URIGenerator';

const defaultResourceRenderers = {
  Manifest: props => ({
    '@context': [
      'http://www.w3.org/ns/anno.jsonld',
      'http://iiif.io/api/presentation/3/context.json',
    ],
    type: 'Manifest',
    label: {
      en: ['Untitled Manifest'],
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

/**
 * Queries a resource form a given root
 * @param {*} id - the resource id to find
 * @param {*} resource - root of the query, in order to narrow down the results more quickly
 */
export const queryResourceById = (id, resource) => {
  if (
    id === null ||
    typeof resource === 'string' ||
    typeof resource === 'number' ||
    typeof resource === 'boolean'
  ) {
    return null;
  }
  if (resource.id === id) {
    return resource;
  } else {
    let subq = null;
    if (Array.isArray(resource)) {
      for (let subResource of resource) {
        subq = queryResourceById(id, subResource);
        if (subq !== null) {
          return subq;
        }
      }
    } else {
      for (let key in resource) {
        subq = queryResourceById(id, resource[key]);
        if (subq !== null) {
          return subq;
        }
      }
    }
  }
  return null;
};

export default renderResource;
