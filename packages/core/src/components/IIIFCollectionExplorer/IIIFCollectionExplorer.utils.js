
const getFirstAnnotationFromState = (canvas, getResource) => {
  let annotation = null;
  if (canvas.items && canvas.items.length) {
    const annotationList = getResource(canvas.items[0]);
    if (annotationList.items && annotationList.items.length) {
      annotation = getResource(annotationList.items[0]);
    }
  }
  return annotation;
};

const getFirstAnnotationFromCanvas = canvas => 
  canvas.items &&
  canvas.items.length &&
  canvas.items[0].items &&
  canvas.items[0].items.length &&
  canvas.items[0].items[0];

const getImageSmallSize = annotation => {
  let worstCaseThumbnail = null;
  if (annotation && annotation.body && annotation.body.id) {
    const iiifImageParts = annotation.body.id.split('/');
    iiifImageParts[iiifImageParts.length - 3] = '!100,100';
    worstCaseThumbnail = iiifImageParts.join('/');
  }
  return worstCaseThumbnail;
}

const getResourceThumbnail = resource => {
  let thumbnail = null;
  if (resource && resource.thumbnail) {
    const firstThumbnail =
        Array.isArray(resource.thumbnail) 
          ? resource.thumbnail[0] 
          : resource.thumbnail;
    if (firstThumbnail) {
      if (typeof firstThumbnail === 'string') {
        thumbnail = firstThumbnail
      } else if (typeof firstThumbnail.id === 'string') {
        thumbnail = firstThumbnail.id;
      }

    }
  }
  return thumbnail;
};

/* Aka. Chain of fragility... */
export const getCanvasThumbnail = (canvas, getResource) => {
  // note this doesn't even deal with the embedded image/thumbnail sizes yet...
  // Best would be to pre-fetch the first canvas figure out which links are working
  // and than set those for the rest of the items, because each and every collection
  // had a slightly different take on this.
  let annotation = getResource 
    ? getFirstAnnotationFromState(canvas, getResource)
    : getFirstAnnotationFromCanvas(canvas);

  return getResourceThumbnail(annotation) ||
    getResourceThumbnail(canvas) ||
    getImageSmallSize(annotation);
};

export const getCollectionThumbnail = getResourceThumbnail;
