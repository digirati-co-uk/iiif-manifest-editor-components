export const isCanvasChangedEditor = (
  nextCanvas,
  currentCanvas,
  getResource
) => {
  if (nextCanvas === null && currentCanvas === null) {
    return false;
  }
  return (
    (nextCanvas !== null && currentCanvas === null) ||
    (nextCanvas === null && currentCanvas !== null) ||
    nextCanvas.id !== currentCanvas.id ||
    nextCanvas.width !== currentCanvas.width ||
    nextCanvas.height !== currentCanvas.height ||
    nextCanvas.items.length !== currentCanvas.items.length ||
    nextCanvas.items
      .map((nextAnnotationListId, index) => {
        const currentAnnotationList = getResource(currentCanvas.items[index]);
        const nextAnnotationList = getResource(nextAnnotationListId);
        return (
          nextAnnotationList.id !== currentAnnotationList.id ||
          (!currentAnnotationList.items && !!nextAnnotationList.items) ||
          (!nextAnnotationList.items && !!currentAnnotationList.items) ||
          nextAnnotationList.items.length !==
            currentAnnotationList.items.length ||
          nextAnnotationList.items
            .map((nextAnnotationId, annotationIndex) => {
              const currentAnnotation = getResource(
                currentAnnotationList.items[annotationIndex]
              );
              const nextAnnotation = getResource(nextAnnotationId);
              return (
                nextAnnotation.id !== currentAnnotation.id ||
                nextAnnotation.target !== currentAnnotation.target ||
                (!nextAnnotation.service && !!currentAnnotation.service) ||
                (!!nextAnnotation.service && !currentAnnotation.service) ||
                (nextAnnotation.service &&
                  currentAnnotation.service &&
                  nextAnnotation.service.id !== currentAnnotation.service.id)
              );
            })
            .indexOf(true) !== -1
        );
      })
      .indexOf(true) !== -1
  );
};

export const isCanvasChangedAnnotationList = (
  nextCanvas,
  currentCanvas,
  getResource
) => {
  //return true;
  if (nextCanvas === null && currentCanvas === null) {
    return false;
  }
  return (
    (nextCanvas !== null && currentCanvas === null) ||
    (nextCanvas === null && currentCanvas !== null) ||
    nextCanvas.id !== currentCanvas.id ||
    nextCanvas.width !== currentCanvas.width ||
    nextCanvas.height !== currentCanvas.height ||
    nextCanvas.items.length !== currentCanvas.items.length ||
    nextCanvas.items
      .map((nextAnnotationListId, index) => {
        const currentAnnotationList = getResource(currentCanvas.items[index]);
        const nextAnnotationList = getResource(nextAnnotationListId);
        return (
          nextAnnotationList.id !== currentAnnotationList.id ||
          (!currentAnnotationList.items && !!nextAnnotationList.items) ||
          (!nextAnnotationList.items && !!currentAnnotationList.items) ||
          nextAnnotationList.items.length !==
            currentAnnotationList.items.length ||
          nextAnnotationList.items
            .map((nextAnnotationId, annotationIndex) => {
              const currentAnnotation = getResource(
                currentAnnotationList.items[annotationIndex]
              );
              const nextAnnotation = getResource(nextAnnotationId);
              return (
                nextAnnotation.id !== currentAnnotation.id ||
                nextAnnotation.target !== currentAnnotation.target ||
                nextAnnotation.motivation !== nextAnnotation.motivation ||
                (nextAnnotation.body &&
                  currentAnnotation.body &&
                  nextAnnotation.body.type !== currentAnnotation.body.type)
              );
            })
            .indexOf(true) !== -1
        );
      })
      .indexOf(true) !== -1
  );
};

export const isCanvasListChanged = (
  nextCanvasList,
  currentCanvasList,
  getResource,
  lang
) => {
  if (nextCanvasList === null && currentCanvasList === null) {
    return false;
  }
  return (
    (nextCanvasList === null && currentCanvasList !== null) ||
    (nextCanvasList !== null && currentCanvasList === null) ||
    nextCanvasList.length !== currentCanvasList.length //
    // TODO: label change
  );
};
