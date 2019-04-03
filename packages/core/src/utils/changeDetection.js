export const isCanvasChangedEditor = (nextCanvas, currentCanvas) => {
  return (
    (nextCanvas !== null && currentCanvas === null) ||
    (nextCanvas === null && currentCanvas !== null) ||
    nextCanvas.id !== currentCanvas.id ||
    nextCanvas.width !== currentCanvas.width ||
    nextCanvas.height !== currentCanvas.height ||
    nextCanvas.items.length !== currentCanvas.items.length ||
    nextCanvas.items
      .map((nextAnnotationList, index) => {
        const currentAnnotationList = currentCanvas.items[index];
        return (
          nextAnnotationList.id !== currentAnnotationList.id ||
          (!currentAnnotationList.items && !!nextAnnotationList.items) ||
          (!nextAnnotationList.items && !!currentAnnotationList.items) ||
          nextAnnotationList.items.length !==
            currentAnnotationList.items.length ||
          nextAnnotationList.items
            .map((nextAnnotation, annotationIndex) => {
              const currentAnnotation =
                currentAnnotationList.items[annotationIndex];
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

export const isCanvasChangedAnnotationList = (nextCanvas, currentCanvas) => {
  return (
    (nextCanvas !== null && currentCanvas === null) ||
    (nextCanvas === null && currentCanvas !== null) ||
    nextCanvas.id !== currentCanvas.id ||
    nextCanvas.width !== currentCanvas.width ||
    nextCanvas.height !== currentCanvas.height ||
    nextCanvas.items.length !== currentCanvas.items.length ||
    nextCanvas.items
      .map((nextAnnotationList, index) => {
        const currentAnnotationList = currentCanvas.items[index];
        return (
          nextAnnotationList.id !== currentAnnotationList.id ||
          (!currentAnnotationList.items && !!nextAnnotationList.items) ||
          (!nextAnnotationList.items && !!currentAnnotationList.items) ||
          nextAnnotationList.items.length !==
            currentAnnotationList.items.length ||
          nextAnnotationList.items
            .map((nextAnnotation, annotationIndex) => {
              const currentAnnotation =
                currentAnnotationList.items[annotationIndex];
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
