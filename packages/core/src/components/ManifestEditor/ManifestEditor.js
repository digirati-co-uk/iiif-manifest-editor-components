import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

const SOUCE_DEST_TYPE = {
  'canvaslist->canvaslist': () => {},
  'annotationlist->annotationlist': () => {},
  'dlcsimagelist->annotationlist': () => {},
  'dlcsimagelist->canvaseditor': () => {},
  'iiifimagelist->canvaslist': () => {},
  'iiifimagelist->annotationlist': () => {},
  'iiifimagelist->canvaseditor': () => {},
};

const ManifestEditor = ({ children, dropConfig = SOUCE_DEST_TYPE }) => (
  <DragDropContext
    onDragEnd={result => {
      if (!result.destination) {
        return;
      }

      const sourceType = result.source.droppableId.replace(/(.*)(\-.*)?/, '$1');
      const destType = result.destination.droppableId.replace(
        /(.*)(\-.*)?/,
        '$1'
      );

      if (dropConfig.hasOwnProperty(`${sourceType}->${destType}`)) {
        dropConfig[`${sourceType}->${destType}`](result);
      }
    }}
  >
    {children}
  </DragDropContext>
);

export default ManifestEditor;
