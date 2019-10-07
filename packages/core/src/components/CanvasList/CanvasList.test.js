import * as React from 'react';
import CanvasList from './CanvasList';
import { DragDropContext } from 'react-beautiful-dnd';

describe('CanvasList', () => {
  it('renders the canvas list unchanged', () => {
    const TEST_CANVASES = [
      {
        id: 'test-canvas-1',
        type: 'Canvas'
      },
      {
        id: 'test-canvas-2',
        type: 'Canvas'
      },
    ];

    const canvasList = render(
      <DragDropContext
        onDragEnd={()=>{}}
      >
        <CanvasList canvases={TEST_CANVASES} />
      </DragDropContext>
    );
    expect(canvasList).toMatchSnapshot();
  });
});
