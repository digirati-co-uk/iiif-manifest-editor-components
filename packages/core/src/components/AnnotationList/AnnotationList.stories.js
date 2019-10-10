import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';

import AnnotationList from './AnnotationList.js';
import AnnotationListItem from './AnnotationListItem';
import { DragDropContext } from 'react-beautiful-dnd';

storiesOf('AnnotationList', module)
  .addDecorator(withKnobs)
  .add('AnnotationList', () => {
    const getResource = id => ({
      id,
      label: { en: [id] },
      type: 'Annotation',
      motivation: 'describing',
      body: {
        type: 'TextualBody',
      },
    });
    return (
      <DragDropContext onDragEnd={() => {}}>
        <AnnotationList
          annotations={['test-annotation-1', 'test-annotation-2']}
          getResource={getResource}
          selected={text('Selected', null)}
          selectedColor={text('Selected Color', 'primary')}
          isEditingAllowed={boolean('Is Editing Allowed', true)}
        />
      </DragDropContext>
    );
  })
  .add('AnnotationListItem', () => {
    const annotation = {
      body: text('Annotation Body', 'Some content here'),
      id: text('Annotation id', 'Some default id'),
      label: text('Label', 'Annotation Label text'),
      classes: null,
      onSelect: () => {},
    };
    return (
      <DragDropContext onDragEnd={() => {}}>
        <AnnotationListItem
          selectedColor={text('Selected solor', 'primary')}
          lang={'en-gb'}
          isSelected={boolean('Is selected', true)}
          annotation={annotation}
        />
      </DragDropContext>
    );
  });
