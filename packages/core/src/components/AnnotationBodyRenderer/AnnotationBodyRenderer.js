import React from 'react';
import PropTypes from 'prop-types';
import NotSupportedAnnotation from '../NotSupportedAnnotation/NotSupportedAnnotation';
import { EditorConsumer } from '../EditorContext/EditorContext';

const AnnotationBodyRenderer = ({ annotation }) => {
  const type = `${annotation.body.type}::${annotation.motivation}`;
  return (
    <EditorConsumer>
      {configuration =>
        configuration.annotation.hasOwnProperty(type)
          ? configuration.annotation[type].contentRenderer(annotation)
          : NotSupportedAnnotation(annotation, type)
      }
    </EditorConsumer>
  );
};

AnnotationBodyRenderer.propTypes = {
  annotation: PropTypes.any.isRequired,
};

export default AnnotationBodyRenderer;
