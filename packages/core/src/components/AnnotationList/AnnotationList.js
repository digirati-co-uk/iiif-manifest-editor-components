import React from 'react';
import PropTypes from 'prop-types';
import Panel from '../Panel/Panel';

const AnnotationList = ({
  children,
  annotations,
  toolbar,
  selectedAnnotations,
}) => (
  <Panel>
    <Panel.Toolbar>{toolbar}</Panel.Toolbar>
    <Panel.Content>
      {annotations.map(annotation =>
        typeof children === 'function' ? (
          children(annotation, null, null)
        ) : (
          <div key={annotation.id}>{annotation.id}</div>
        )
      )}
    </Panel.Content>
  </Panel>
);

AnnotationList.propTypes = {
  children: PropTypes.any,
  annotations: PropTypes.array,
  toolbar: PropTypes.any,
  selectedAnnotations: PropTypes.array,
};

AnnotationList.defaultProps = {
  toolbar: 'toolbar missing',
  selectedAnnotations: [],
};

export default AnnotationList;
