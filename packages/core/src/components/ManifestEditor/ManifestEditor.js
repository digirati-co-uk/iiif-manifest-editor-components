import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { EditorConsumer, EditorProvider } from '../EditorContext/EditorContext';

const ManifestEditor = ({
  children,
  invokeAction,
  config = {},
  annotation,
  translation,
  dragDrop,
}) => (
  <EditorProvider
    configuration={config}
    annotation={annotation}
    translation={translation}
    dragDrop={dragDrop}
  >
    <EditorConsumer>
      {configuration => (
        <DragDropContext
          onDragEnd={result => {
            if (!result.destination) {
              return;
            }
            const dragDropConf = configuration.dragDrop;
            const sourceType = result.source.droppableId.replace(
              /(.*)(\-.*)?/,
              '$1'
            );
            const destType = result.destination.droppableId.replace(
              /(.*)(\-.*)?/,
              '$1'
            );
            const dropHandler = `${sourceType}->${destType}`;
            if (dragDropConf.hasOwnProperty(dropHandler)) {
              invokeAction(dragDropConf[dropHandler], result)();
            }
          }}
        >
          {children}
        </DragDropContext>
      )}
    </EditorConsumer>
  </EditorProvider>
);

export default ManifestEditor;
