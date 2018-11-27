import React from 'react';
import PropTypes from 'prop-types';

const CanvasList = ({ canvases, toolbar, selectedCanvases }) => (
  <div className="canvas-list">
    <div className="canvas-list__toobar">{toolbar}</div>
    <div className="canvas-list__content">
      {canvases.map(canvas => (
        <div key={canvases.id}>{canvases.id}</div>
      ))}
    </div>
  </div>
);

CanvasList.propTypes = {
  canvases: PropTypes.array,
  toolbar: PropTypes.any,
  selectedCanvases: PropTypes.array,
};

CanvasList.defaultProps = {
  toolbar: 'toolbar missing',
  selectedCanvases: [],
};

export default CanvasList;
