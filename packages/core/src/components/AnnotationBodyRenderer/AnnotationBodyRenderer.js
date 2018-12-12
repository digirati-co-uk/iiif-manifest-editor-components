import React from 'react';
import { getW3cAnnotationStyle } from '../../utils/IIIFResource';
import { EditorConsumer } from '../EditorContex/EditorContext';

const NotSupportedContentType = (annotation, type) => (
  <p style={getW3cAnnotationStyle(annotation.style || '')}>
    Annotation type[{type}] not supported.
  </p>
);

const AnnotationBodyRenderer = ({ annotation }) => {
  const type = `${annotation.body.type}::${annotation.motivation}`;
  return (
    <EditorConsumer>
      {configuration => {
        if (configuration.annotation.hasOwnProperty(type)) {
          return configuration.annotation[type].contentRenderer(annotation);
        } else {
          return NotSupportedContentType(annotation, type);
        }
      }}
    </EditorConsumer>
  );
};

export default AnnotationBodyRenderer;
