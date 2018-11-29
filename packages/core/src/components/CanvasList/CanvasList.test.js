import React from 'react';
import CanvasList from './CanvasList';

describe('CanvasList', () => {
  it('renders the canvas list unchanged', () => {
    const TEST_CANVASES = [
      {
        id: 'test-canvas-1',
      },
      {
        id: 'test-canvas-2',
      },
    ];

    const canvasList = shallow(<CanvasList canvases={TEST_CANVASES} />);
    expect(canvasList).toMatchSnapshot();
  });
});
