import * as React from 'react';
import AnnotationList from './AnnotationList';

describe('AnnotationList', () => {
  it('renders the annotations list unchanged', () => {
    const TEST_ANNOTATIONS = [
      {
        id: 'test-annotation-1',
      },
      {
        id: 'test-annotation-2',
      },
    ];

    const annotationList = shallow(
      <AnnotationList annotations={TEST_ANNOTATIONS} />
    );
    expect(annotationList).toMatchSnapshot();
  });
});
