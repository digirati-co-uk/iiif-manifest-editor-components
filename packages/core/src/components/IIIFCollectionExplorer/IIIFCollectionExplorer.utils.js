/* Aka. Chain of fragility... */
export const getCanvasThumbnail = (canvas, getResource) => {
  // note this doesn't even deal with the embeded image/thumbnail sizes yet...
  // Best would be to pre-fetch the firtst canvas figure out which links are working
  // and than set those for the rest of the items, because each and every collection
  // had a slightly different take on this.
  let thumbnail = null;
  let useLazy = false;
  let worstCaseThumbnail = null;
  let annotation = null;
  if (getResource) {
    if (canvas.items && canvas.items.length) {
      const annotationList = getResource(canvas.items[0]);
      if (annotationList.items && annotationList.items.length) {
        annotation = getResource(annotationList.items[0]);
      }
    }
  } else {
    annotation =
      canvas.items &&
      canvas.items.length &&
      canvas.items[0].items &&
      canvas.items[0].items.length &&
      canvas.items[0].items[0]; // hopefully for now
  }

  if (annotation && annotation.body && annotation.body.id) {
    const iiifImageParts = annotation.body.id.split('/');
    iiifImageParts[iiifImageParts.length - 3] = '!100,100';
    worstCaseThumbnail = iiifImageParts.join('/');
  }

  if (annotation && annotation.thumbnail) {
    if (typeof annotation.thumbnail === 'string') {
      thumbnail = annotation.thumbnail;
    } else if (
      Array.isArray(annotation.thumbnail) &&
      annotation.thumbnail.length
    ) {
      thumbnail =
        typeof annotation.thumbnail[0] === 'string'
          ? annotation.thumbnail[0]
          : annotation.thumbnail[0].id;
    } else if (annotation.thumbnail.id) {
      thumbnail = annotation.thumbnail.id;
    }
  }
  if (thumbnail === null && canvas.thumbnail) {
    if (typeof canvas.thumbnail === 'string') {
      thumbnail = canvas.thumbnail;
    } else if (Array.isArray(canvas.thumbnail) && canvas.thumbnail.length) {
      thumbnail =
        typeof canvas.thumbnail[0] === 'string'
          ? canvas.thumbnail[0]
          : canvas.thumbnail[0].id;
    } else if (canvas.thumbnail.id) {
      thumbnail = canvas.thumbnail.id;
    }
  }
  if (thumbnail === null && worstCaseThumbnail !== null) {
    // use lazy turned off because it turned out that it is slower
    // if used together with the react-virtualized...
    thumbnail = worstCaseThumbnail;
    useLazy = false;
  }

  return [thumbnail, useLazy];
};

export const getCollectionThumbnail = resource => {
  let thumbnail = null;
  if (resource.thumbnail) {
    if (typeof resource.thumbnail === 'string') {
      thumbnail = resource.thumbnail;
    } else if (Array.isArray(resource.thumbnail) && resource.thumbnail.length) {
      thumbnail =
        typeof resource.thumbnail[0] === 'string'
          ? resource.thumbnail[0]
          : resource.thumbnail[0].id;
    } else if (resource.thumbnail.id) {
      thumbnail = resource.thumbnail.id;
    }
  }
  return thumbnail;
};
