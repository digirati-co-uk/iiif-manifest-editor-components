import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { EditorConsumer, EditorProvider } from '../EditorContext/EditorContext';

const TYPE_RX = /(.*)(\-.*)?/;

const ManifestEditor = ({
  children,
  invokeAction,
  config = {},
  annotation,
  translation,
  behavior,
  dragDrop,
}) => (
  <EditorProvider
    configuration={config}
    annotation={annotation}
    translation={translation}
    dragDrop={dragDrop}
    behavior={behavior}
  >
    <EditorConsumer>
      {configuration => (
        <DragDropContext
          onDragEnd={result => {
            if (!result.destination) {
              return;
            }
            const dragDropConf = configuration.dragDrop;
            const sourceType = result.source.droppableId.replace(TYPE_RX, '$1');
            const destType = result.destination.droppableId.replace(
              TYPE_RX,
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
