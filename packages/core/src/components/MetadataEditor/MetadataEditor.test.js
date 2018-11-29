import React from 'react';
import MetadataEditor from './MetadataEditor';

describe('MetadataEditor', () => {
  it('renders the editable canvas unchanged', () => {
    const TEST_CANVAS = {
      id: 'test-canvas-1',
    };
    const TEST_ANNOTATION = {
      id: 'test-annotation-1',
    };
    const TEST_MANIFEST = {
      id: 'test-manifest-1',
    };

    const editableCanvas = shallow(
      <MetadataEditor
        manifest={TEST_MANIFEST}
        canvas={TEST_CANVAS}
        annotation={TEST_ANNOTATION}
        lang={'en'}
      />
    );
    expect(editableCanvas).toMatchSnapshot();
  });
});
