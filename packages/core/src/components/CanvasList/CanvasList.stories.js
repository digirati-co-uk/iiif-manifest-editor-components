import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';

import CanvasList from './CanvasList.js';
import { DragDropContext } from 'react-beautiful-dnd';

storiesOf('CanvasList', module)
  .addDecorator(withKnobs)
  .add('CanvasList', () => {
    const TEST_CANVASES = [
      {
        id: 'test-canvas-1',
        type: 'Canvas',
      },
      {
        id: 'test-canvas-2',
        type: 'Canvas',
      },
    ];
    return (
      <DragDropContext onDragEnd={() => {}}>
        <CanvasList
          direction={text('Horizontal', 'horizontal')}
          canvases={TEST_CANVASES}
          selected={text('Selected', 'test-canvas-1')}
        />
      </DragDropContext>
    );
  });
