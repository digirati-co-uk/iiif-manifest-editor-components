import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { EditorConsumer } from '../EditorContex/EditorContext';

const ManifestEditor = ({ children, invokeAction }) => (
  <EditorConsumer>
    {configuration => (
      <DragDropContext
        onDragEnd={result => {
          if (!result.destination) {
            return;
          }
          const dragDrop = configuration.dragDrop;
          const sourceType = result.source.droppableId.replace(
            /(.*)(\-.*)?/,
            '$1'
          );
          const destType = result.destination.droppableId.replace(
            /(.*)(\-.*)?/,
            '$1'
          );
          const dropHandler = `${sourceType}->${destType}`;
          if (dragDrop.hasOwnProperty(dropHandler)) {
            invokeAction(dragDrop[dropHandler], result)();
          }
        }}
      >
        {children}
      </DragDropContext>
    )}
  </EditorConsumer>
);

export default ManifestEditor;
