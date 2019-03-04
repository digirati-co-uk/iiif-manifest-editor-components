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
    let xywh = getHashParams(annotation.target.id || annotation.target).xywh;
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

// Internal 'magic constants' for the updater, will be updated when
// new issues rising unfortunately I had to cut some time on the
// implementation of this and will return to implement the update
// properly later on.
const ARRAY_TYPE_KEYS = ['metadata', 'thumbnail', 'behavior'];
const SINGLE_VALUE_KEYS = ['navDate', 'rights', 'behavior', 'id'];

export const update = (target, property, lang, value) => {
  //TODO: should be just a dispatch,
  // This whole thing getting messy and unreadable,
  // please rethink the structure.
  const targetClone = JSON.parse(JSON.stringify(target));
  let currentLevel = targetClone;
  const keys = property ? property.split('.') : [];
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
    if (keys.length === 0) {
      // if no property set we just pass the value...
      // this is a hack for now. Fix it later.
      return value;
    } else if (lang === null) {
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

const URL_CACHE = {};
const PROPS_TO_COPY_IF_EXIST = ['width', 'height', 'sizes', 'duration'];

export const updateDisplayProperties = (
  target,
  property,
  lang,
  value,
  callback
) => {
  console.log(value);
  if (URL_CACHE.hasOwnProperty(value)) {
    console.log('keshiz');
    callback(URL_CACHE[value]);
    return;
  }

  fetch(value)
    .then(response => {
      if (!response.ok) {
        callback(null);
        return;
      }
      const contentType = response.headers.get('Content-Type');
      if (!contentType) {
        callback(null);
        return;
      }
      if (
        contentType.startsWith('application/json') ||
        contentType.startsWith('application/ld+json')
      ) {
        return response.json();
      } else if (contentType.startsWith('image/')) {
        const img = new Image();
        img.onload = () => {
          URL_CACHE[value] = {
            width: img.naturalWidth,
            height: img.naturalHeight,
          };
          callback(URL_CACHE[value]);
        };
        img.src = value;
      } else if (contentType.startsWith('video/')) {
        const vid = document.createElement('video');
        vid.onloadedmetadata = () => {
          URL_CACHE[value] = {
            width: vid.videoWidth,
            height: vid.videoHeight,
            duration: vid.duration,
          };
          callback(URL_CACHE[value]);
        };
        vid.src = value;
      } else if (contentType.startsWith('audio/')) {
        const au = document.createElement('audio');
        au.onloadedmetadata = () => {
          URL_CACHE[value] = {
            duration: au.duration,
          };
          callback(URL_CACHE[value]);
        };
        au.src = value;
      } else {
        callback({
          width: undefined,
          duration: undefined,
          height: undefined,
        });
      }
    })
    .then(data => {
      const result = {};
      PROPS_TO_COPY_IF_EXIST.forEach(key => {
        result[key] = data ? data[key] || undefined : undefined;
      });
      URL_CACHE[value] = result;
      callback(URL_CACHE[value]);
    })
    .catch(err => {
      callback(null);
    });
};

const REQUIRE_META_UPDATE = [
  'body.id',
  'body.service.id',
  'thumbnail.0.id',
  'thumbnail.0.service.id',
];

export const updateWithMeta = (target, property, lang, value, ready) => {
  ready(target, property, lang, value);
  if (REQUIRE_META_UPDATE.indexOf(property) !== -1) {
    updateDisplayProperties(target, property, lang, value, extraProps => {
      let result = target;
      if (extraProps) {
        Object.entries(extraProps).forEach(([key, data]) => {
          result = update(
            result,
            property.replace(/\.id$/, `.${key}`),
            lang,
            data
          );
        });
      }
      // TODO: make this as a plugin after the system functionally complete
      result = dlcsExtras(result, property, lang, value, ready);
      ready(result, property, lang, value);
    });
  }
};

const dlcsExtras = (target, property, lang, value, ready) => {
  if (!(typeof value === 'string' && value.indexOf('//dlc.services/') !== -1)) {
    return;
  }
  var result = target;
  if (property === 'body.service.id') {
    result = update(
      result,
      'body.id',
      lang,
      value.replace('/info.json', '') + '/full/full/0/default.jpg',
      ready
    );

    result = update(
      result,
      'thumbnail.0.service.id',
      lang,
      value.replace('/iiif-img/', '/thumbs/'),
      ready
    );
  }

  if (property === 'body.service.id' || property === 'thumbnail.0.service.id') {
    result = update(
      result,
      'thumbnail.0.id',
      lang,
      value.replace('/info.json', '').replace('/iiif-img/', '/thumbs/') +
        '/full/full/0/default.jpg',
      ready
    );
  }
  return result;
};

const DEFAULT_ANNOTATION_WIDTH = 300;
const DEFAULT_ANNOTATION_HEIGHT = 200;

export const getAnnotationDimensions = annotation => {
  if (annotation.body) {
    if (annotation.body.service) {
      if (
        Array.isArray(annotation.body.service) &&
        annotation.body.service.length > 0 &&
        annotation.body.service[0].width &&
        annotation.body.service[0].height
      ) {
        return {
          width: annotation.body.service[0].width,
          height: annotation.body.service[0].height,
        };
      } else if (
        annotation.body.service.width &&
        annotation.body.service.height
      ) {
        return {
          width: annotation.body.service.width,
          height: annotation.body.service.height,
        };
      }
    }
    if (annotation.body.width && annotation.body.height) {
      return {
        width: annotation.body.width,
        height: annotation.body.height,
      };
    }
  }
  return {
    width: DEFAULT_ANNOTATION_WIDTH,
    height: DEFAULT_ANNOTATION_HEIGHT,
  };
};

export const fixManifest = manifest => {
  const idMappings = {};
  const updateTargetURI = target => {
    const [targetURI, targetHash] = target.split('#');
    return [idMappings[targetURI] || targetURI, targetHash].join('#');
  };
  const fixLevel = (level, parentResource) => {
    if (Array.isArray(level)) {
      level.forEach(item => fixLevel(item, parentResource));
    }
    if (level.hasOwnProperty('type')) {
      let oldURI = null;
      if (level.hasOwnProperty('id')) {
        oldURI = level.id;
      }
      if (idMappings.hasOwnProperty(oldURI) || !level.hasOwnProperty('id')) {
        if (level.type === 'Manifest') {
          level.id = manifest.id || generateURI(level);
        } else {
          generateURI(level, parentResource);
        }
        if (oldURI) {
          idMappings[oldURI] = level.id;
        }
      }
    }
    if (level.hasOwnProperty('target')) {
      if (typeof level.target === 'string') {
        level.target = updateTargetURI(level.target);
      } else if (level.target.hasOwnProperty('id')) {
        level.target.id = updateTargetURI(level.target.id);
      }
    }
    if (level.hasOwnProperty('annotations')) {
      level.items[0].items = []
        .concat(level.items[0].items)
        .concat(level.annotations[0].items);
      delete level.annotations;
    }
    Object.entries(level).forEach(([name, item]) => {
      // temp fix for services
      if (name === 'service') {
        if (Array.isArray(item)) {
          level.service = item[0];
        }
      }
      if (
        typeof item !== 'string' &&
        typeof item !== 'number' &&
        typeof item !== 'boolean'
      ) {
        if (level.hasOwnProperty('type') && level.hasOwnProperty('id')) {
          fixLevel(item, level);
        } else {
          fixLevel(item, parentResource);
        }
      }
    });
  };
  fixLevel(manifest, null);
  return manifest;
};
