import React from 'react';
import EditableCanvas from './EditableCanvas';

describe('EditableCanvas', () => {
  it('renders the editable canvas unchanged', () => {
    const TEST_CANVAS = {
      id: 'test-canvas-1',
    };

    const editableCanvas = shallow(<EditableCanvas canvas={TEST_CANVAS} />);
    expect(editableCanvas).toMatchSnapshot();
  });
});
