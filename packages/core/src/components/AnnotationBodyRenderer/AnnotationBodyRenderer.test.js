import * as React from 'react';
import AnnotationBodyRenderer from './AnnotationBodyRenderer';

describe("AnnotationBodyRenderer", () => {
  it('Renders NotSupportedAnnotation if the passed annotation is not configured', () => {
    const annotation = {
      motivation: 'painting',
      body: {
        type: '3DModel'
      }
    };
    const renderedBody = render(<AnnotationBodyRenderer annotation={annotation}/>);
    expect(renderedBody).toMatchSnapshot();
  });
  it('Renders NotSupportedAnnotation if the passed annotation exist', () => {
    const annotation = {
      motivation: 'painting',
      body: {
        type: 'TextualBody',
        value: 'test',
      }
    };
    const renderedBody = render(<AnnotationBodyRenderer annotation={annotation}/>);
    expect(renderedBody).toMatchSnapshot();
  });
})