import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';
import { DragDropContext } from 'react-beautiful-dnd';
import ManifestEditor from './ManifestEditor.js';

storiesOf('ManifestEditor', module)
  .addDecorator(withKnobs)
  .add('ManifestEditor', () => {
    return (
      <DragDropContext onDragEnd={() => {}}>
        <ManifestEditor
          children={<div>Some child div</div>}
          invokeAction={() => {}}
          config={[]}
          annotation={{}}
          translation={null}
          metaOntology={null}
          behavior={null}
          annotationFormButtons={null}
          propertyFields={null}
          dragDrop={() => {}}
          iiifResourceDefaults={null}
          propertyPanel={null}
        />
      </DragDropContext>
    );
  });
