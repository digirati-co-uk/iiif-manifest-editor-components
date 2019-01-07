import generateURI from './URIGenerator';
import convertToV3ifNecessary from './IIIFUpgrader';

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
    resource === null ||
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

export const getParentByChildId = (id, resource, parent = null) => {
  if (
    id === null ||
    resource === null ||
    typeof resource === 'string' ||
    typeof resource === 'number' ||
    typeof resource === 'boolean'
  ) {
    return null;
  }
  if (resource.id === id) {
    return parent;
  } else {
    let subq = null;
    if (Array.isArray(resource)) {
      for (let subResource of resource) {
        subq = getParentByChildId(id, subResource, parent);
        if (subq !== null) {
          return subq;
        }
      }
    } else {
      let newParent = resource.hasOwnProperty('type') ? resource : parent;
      for (let key in resource) {
        subq = getParentByChildId(id, resource[key], newParent);
        if (subq !== null) {
          return subq;
        }
      }
    }
  }
  return null;
};

export const getPath = (id, resource, path = []) => {
  if (
    id === null ||
    resource === null ||
    typeof resource === 'string' ||
    typeof resource === 'number' ||
    typeof resource === 'boolean'
  ) {
    return null;
  }
  if (resource.id === id) {
    return [].concat(path).concat([resource]);
  } else {
    let subq = null;
    if (Array.isArray(resource)) {
      for (let subResource of resource) {
        subq = getPath(id, subResource, path);
        if (subq !== null) {
          return subq;
        }
      }
    } else {
      const nextPath = resource.hasOwnProperty('type')
        ? [].concat(path).concat(resource)
        : path;
      for (let key in resource) {
        subq = getPath(id, resource[key], nextPath);
        if (subq !== null) {
          return subq;
        }
      }
    }
  }
  return null;
};

export default renderResource;

export const locale = (item, lang, fallback) => {
  if (!item) {
    return fallback || '';
  }
  if (!lang) {
    const keys = Object.keys(item);
    if (keys.length > 0) {
      return item[keys[0]];
    }

    return fallback || '';
  }

  if (item[lang]) {
    return item[lang].join('\n');
  }

  return fallback || '';
};

export const getHashParams = uri => {
  let hashParams = uri.split('#')[1];
  if (hashParams) {
    return hashParams.split('&').reduce((result, item) => {
      let [_key, _value] = item.split('=');
      result[_key] = _value;
      return result;
    }, {});
  }
  return {};
};

export const makeURLHash = obj => {
  let result = '';
  if (obj) {
    result = Object.entries(obj)
      .reduce((acc, [_key, _value]) => {
        acc.push(`${_key}=${_value}`);
        return acc;
      }, [])
      .join('&');
  }
  return result.length > 0 ? `#${result}` : '';
};

export const getBounds = (annotation, canvas) => {
  if (annotation.type === 'Annotation' && annotation.target) {
    let xywh = getHashParams(annotation.target).xywh;
    if (xywh) {
      let [x, y, w, h] = xywh.split(',');
      return {
        x: parseInt(x, 10),
        y: parseInt(y, 10),
        w: parseInt(w, 10),
        h: parseInt(h, 10),
      };
    } else {
      return {
        x: 0,
        y: 0,
        w: canvas.width,
        h: canvas.height,
      };
    }
  }
  //TODO: ???
};

export const getW3cAnnotationStyle = styleStr =>
  styleStr.split(';').reduce((acc, item) => {
    let [key, value] = item.split(':');
    if (key) {
      if (key.trim()) {
        let camelisedKey = key
          .trim()
          .replace(/\-[a-zA-Z]/g, match => match[1].toUpperCase());
        acc[camelisedKey] = value;
      }
    }
    return acc;
  }, {});

export const getCanvasFromExternalManifest = (manifestId, canvasId) =>
  fetch(manifestId)
    .then(response => response.json())
    .then(resource => convertToV3ifNecessary(resource))
    .then(resource => {
      let canvases = resource.items.filter(item => item.id === canvasId);
      if (canvases.length > 0) {
        const canvas = canvases[0];
        return canvas;
      }
      throw `Cannot retrieve canvas ${canvasId} from ${manifestId}`;
    })
    .catch(err => console.log(err));

// Internal 'magic constants' for the updater, will be updated when
// new issues rising unfortunately I had to cut some time on the
// implementation of this and will return to implement the update
// properly later on.
const ARRAY_TYPE_KEYS = ['metadata', 'thumbnail'];
const SINGLE_VALUE_KEYS = ['navDate', 'rights'];

export const update = (target, property, lang, value) => {
  //TODO: should be just a dispatch,
  // This whole thing getting messy and unreadable,
  // please rethink the structure.
  const targetClone = JSON.parse(JSON.stringify(target));
  let currentLevel = targetClone;
  const keys = property.split('.');
  if (keys.length > 1) {
    keys.forEach((key, index) => {
      if (lang === null && index === keys.length - 1) {
        currentLevel[key] = value;
      } else {
        if (!currentLevel[key]) {
          currentLevel[key] = ARRAY_TYPE_KEYS.indexOf(key) !== -1 ? [] : {};
        }
        currentLevel = currentLevel[key];
      }
    });
    if (lang !== null) {
      currentLevel[lang] = value.split('\n');
    }
  } else {
    if (lang === null) {
      targetClone[property] =
        SINGLE_VALUE_KEYS.indexOf(property) !== -1 ? value : value.split('\n');
    } else {
      if (!targetClone.hasOwnProperty(property)) {
        targetClone[property] = {};
      }
      currentLevel[property][lang] = value.split('\n');
    }
  }
  return targetClone;
};
