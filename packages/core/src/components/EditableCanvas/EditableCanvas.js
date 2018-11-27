import React from 'react';
import PropTypes from 'prop-types';

const EditableCanvas = ({ canvas }) => <div>EditableCanvas</div>;

EditableCanvas.propTypes = {
  canvas: PropTypes.object,
};

EditableCanvas.defaultProps = {
  canvas: null,
};

export default EditableCanvas;
