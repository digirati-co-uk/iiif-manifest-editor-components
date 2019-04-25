import * as React from 'react';
import * as PropTypes from 'prop-types';
import NotSupportedAnnotation from '../NotSupportedAnnotation/NotSupportedAnnotation';
import { EditorConsumer } from '../EditorContext/EditorContext';
import { getInternalAnnotationType } from '../../utils/IIIFResource';
const AnnotationBodyRenderer = ({ annotation }) => (
  <EditorConsumer>
    {configuration => {
      const type = getInternalAnnotationType(annotation);
      return configuration.annotation.hasOwnProperty(type)
        ? configuration.annotation[type].contentRenderer(annotation)
        : NotSupportedAnnotation(annotation, type)
    }}
  </EditorConsumer>
);

AnnotationBodyRenderer.propTypes = {
  annotation: PropTypes.any.isRequired,
};

export default AnnotationBodyRenderer;
