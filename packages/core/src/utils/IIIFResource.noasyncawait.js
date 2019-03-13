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

const IIIF_IMAGE_API_VERSION_MAPPING = {
  'http://library.stanford.edu/iiif/image-api/1.1/context.json': 1,
  'http://iiif.io/api/image/2/context.json': 2,
  'http://iiif.io/api/image/3/context.json': 3,
};

const determineImageServiceVersion = infoJson => {
  if (!infoJson || !infoJson.hasOwnProperty('@context')) {
    return null;
  }
  const context = infoJson['@context'];
  if (typeof context === 'string') {
    return IIIF_IMAGE_API_VERSION_MAPPING[context];
  } else if (Array.isArray(context)) {
    return context.reduce((version, contextItem) => {
      if (version) {
        return version;
      } else {
        return IIIF_IMAGE_API_VERSION_MAPPING[contextItem];
      }
    }, null);
  }
  return null;
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
  // if (URL_CACHE.hasOwnProperty(value)) {
  //   callback(URL_CACHE[value]);
  //   return;
  // }

  let url = value;
  if (property === 'body.service.id' || property === 'thumbnail.0.service.id') {
    url = value.endsWith('/info.json') ? value : value + '/info.json';
  }

  let isDlcs = false;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        callback(null);
        return;
      }
      const contentType = response.headers.get('Content-Type');
      // TODO: not going to happen this way cors mode doesn't allow to get custom headers
      // isDlcs = !!response.headers.get('x-dlcs');
      isDlcs = url.startsWith('https://dlc.services/');
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
      // console.log(
      //   'updateDisplayProperties->response' + JSON.stringify(result, null, 2)
      // );
      callback(URL_CACHE[value], {
        serviceVersion: determineImageServiceVersion(data),
        dlcs: isDlcs,
        info: data,
      });
    })
    .catch(err => {
      console.log('fetch(url)', url, err);
      callback(null);
    });
};

const extraUpdates = (result, property, lang, extraProps) => {
  if (extraProps) {
    Object.entries(extraProps).forEach(([key, data]) => {
      result = update(result, property.replace(/\.id$/, `.${key}`), lang, data);
    });
  }
  return result;
};

const updateWithMetaCallbackHell = (target, property, lang, value, ready) => {
  console.log(value);
  const urlsToFetch = [];
  let val = value;
  let tnVal = value;
  let result = target;
  switch (property) {
    case 'body.service.id':
      updateBodyService(result, property, lang, value, ready);
      break;
    case 'thumbnail.0.service.id':
      updateThumbnailService(result, property, lang, value, ready);
      break;
    case 'body.id':
      updateBodyId(result, property, lang, value, ready);
      break;
    case 'thumbnail.0.id':
      updateThumbnailId(result, property, lang, value, ready);
      break;
    default:
      update(result, property, lang, value);
      ready(result, property, lang, value);
      break;
  }
};

const updateBodyService = (result, property, lang, value, ready) => {
  //console.log('updateBodyService', result, property, lang, value, ready);
  result = update(result, 'body.service.id', lang, value);
  //const val = value.endsWith('/info.json') ? value : value + '/info.json';
  updateDisplayProperties(
    result,
    'body.service.id',
    lang,
    value,
    (extraProps, data) => {
      if (extraProps === null) {
        ready(result, property, lang, value, ready);
      }
      result = extraUpdates(result, property, lang, extraProps);
      const startsWithBackslash = value.endsWith('/') ? '' : '/';
      const sizeString =
        data && data.serviceVersion > 2 ? 'full/max/' : 'full/full/';
      if (data.dlcs) {
        updateThumbnailService(
          result,
          'thumbnail.0.service.id',
          lang,
          value.replace('/iiif-img/', '/thumbs/'),
          (res, prop, lan, val) => {
            updateBodyId(
              res,
              'body.id',
              lan,
              `${value}${startsWithBackslash}${sizeString}0/default.jpg`,
              ready
            );
          }
        );
      } else {
        console.log('here', data.info);
        try {
          const thumbnailSeriviceId = result.thumbnail[0].service.id;
          if (!thumbnailSeriviceId) {
            //console.log(data.info);
            if (extraProps.sizes && extraProps.sizes.length) {
              console.log(extraProps.sizes[0]);
              const { width, height } = extraProps.sizes[0];

              updateThumbnailId(
                result,
                'thumbnail.0.id',
                lang,
                `${value}/full/${width},${height}/0/default.jpg`,
                (res, prop, lan, val) => {
                  updateBodyId(
                    res,
                    'body.id',
                    lan,
                    `${value}${startsWithBackslash}${sizeString}0/default.jpg`,
                    ready
                  );
                }
              );
            } else {
              updateThumbnailId(
                result,
                'thumbnail.0.id',
                lang,
                `${value}${startsWithBackslash}${sizeString}0/default.jpg`,
                (res, prop, lan, val) => {
                  updateBodyId(
                    res,
                    'body.id',
                    lan,
                    `${value}${startsWithBackslash}${sizeString}0/default.jpg`,
                    ready
                  );
                }
              );
            }
          }
        } catch (ex) {
          updateBodyId(
            result,
            'body.id',
            lang,
            `${value}${startsWithBackslash}${sizeString}0/default.jpg`,
            ready
          );
        }
      }
    }
  );
};

const updateBodyId = (result, property, lang, value, ready) => {
  //console.log('updateBodyId', result, property, lang, value, ready);
  result = update(result, 'body.id', lang, value);
  updateDisplayProperties(result, property, lang, value, extraProps => {
    result = extraUpdates(result, property, lang, extraProps);
    ready(result, property, lang, value);
  });
};

const updateThumbnailService = (result, property, lang, value, ready) => {
  //console.log('updateThumbnailService', result, property, lang, value, ready);
  result = update(result, 'thumbnail.0.service.id', lang, value);
  updateDisplayProperties(result, property, lang, value, (extraProps, data) => {
    if (extraProps === null) {
      ready(result, property, lang, value, ready);
    }
    result = extraUpdates(result, property, lang, extraProps);
    const startsWithBackslash = value.endsWith('/') ? '' : '/';
    const sizeString = data.serviceVersion > 2 ? 'full/max/' : 'full/full/';
    updateThumbnailId(
      result,
      'thumbnail.0.id',
      lang,
      `${value}${startsWithBackslash}${sizeString}0/default.jpg`,
      ready
    );
  });
};

const updateThumbnailId = (result, property, lang, value, ready) => {
  //console.log('updateThumbnailId', result, property, lang, value, ready);
  result = update(result, 'thumbnail.0.id', lang, value);
  updateDisplayProperties(result, property, lang, value, extraProps => {
    result = extraUpdates(result, property, lang, extraProps);
    ready(result, property, lang, value);
  });
};

export default updateWithMetaCallbackHell;
