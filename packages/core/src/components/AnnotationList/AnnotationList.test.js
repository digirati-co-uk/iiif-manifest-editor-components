import * as React from 'react';
import AnnotationList from './AnnotationList';
import { DragDropContext } from 'react-beautiful-dnd';

describe('AnnotationList', () => {
  it('renders the annotations list unchanged', () => {
    const getResource = id => ({
      id,
      label: { en: [id] },
      type: "Annotation",
      motivation: 'describing',
      body: {
        type: 'TextualBody',
      }
    })

    const annotationList = render(
      <DragDropContext
        onDragEnd={()=>{}}
      >
        <AnnotationList 
          annotations={['test-annotation-1', 'test-annotation-2']} 
          getResource={getResource}
        />
      </DragDropContext>
    );
    expect(annotationList).toMatchSnapshot();
  });
});
