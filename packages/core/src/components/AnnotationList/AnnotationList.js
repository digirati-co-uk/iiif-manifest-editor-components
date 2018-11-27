import React from 'react';
import PropTypes from 'prop-types';

import './AnnotationList.scss';

const AnnotationList = ({ annotations, toolbar, selectedAnnotations }) => (
  <div className="annotation-list">
    <div className="annotation-list__toobar">{toolbar}</div>
    <div className="annotation-list__content">
      {annotations.map(annotation => (
        <div key={annotation.id}>{annotation.id}</div>
      ))}
    </div>
  </div>
);

AnnotationList.propTypes = {
  annotations: PropTypes.array,
  toolbar: PropTypes.any,
  selectedAnnotations: PropTypes.array,
};

AnnotationList.defaultProps = {
  toolbar: 'toolbar missing',
  selectedAnnotations: [],
};

export default AnnotationList;
