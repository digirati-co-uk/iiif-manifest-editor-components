import React from 'react';
import { getW3cAnnotationStyle } from '../../utils/IIIFResource';

const NotSupportedAnnotation = (annotation, type) => (
  <p style={getW3cAnnotationStyle(annotation.style || '')}>
    Annotation type[{type}] not supported.
  </p>
);

export default NotSupportedAnnotation;
