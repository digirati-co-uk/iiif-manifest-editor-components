import * as React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { EditorConsumer, EditorProvider } from '../EditorContext/EditorContext';
import { LabelProvider } from '../LabelContext/LabelContext';

const TYPE_RX = /(.*)(\-.*)?/;

const ManifestEditor = ({
  children,
  invokeAction,
  config = {},
  annotation,
  translation,
  metaOntology,
  behavior,
  annotationFormButtons,
  propertyFields,
  dragDrop,
  iiifResourceDefaults,
  propertyPanel,
}) => (
  <EditorProvider
    configuration={config}
    annotation={annotation}
    translation={translation}
    dragDrop={dragDrop}
    behavior={behavior}
    annotationFormButtons={annotationFormButtons}
    propertyFields={propertyFields}
    iiifResourceDefaults={iiifResourceDefaults}
    propertyPanel={propertyPanel}
  >
    <LabelProvider value={metaOntology}>
      <EditorConsumer>
        {configuration => (
          <DragDropContext
            onDragEnd={result => {
              if (!result.destination) {
                return;
              }
              const dragDropConf = configuration.dragDrop;
              const sourceType = result.source.droppableId.replace(
                TYPE_RX,
                '$1'
              );
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
    </LabelProvider>
  </EditorProvider>
);

ManifestEditor.defaultProps = {
  metaOntology: {},
  annotationFormButtons: null,
};

export default ManifestEditor;
