import React from 'react';
import PropTypes from 'prop-types';
import Panel from '../Panel/Panel';

const CanvasList = ({ children, canvases, toolbar, selectedCanvases }) => (
  <Panel horizontal={true}>
    {toolbar && <Panel.Toolbar>{toolbar}</Panel.Toolbar>}
    <Panel.Content>
      {canvases.map(canvas =>
        typeof children === 'function' ? (
          children(canvas, null, null)
        ) : (
          <div key={canvases.id}>{canvases.id}</div>
        )
      )}
    </Panel.Content>
  </Panel>
);

CanvasList.propTypes = {
  /* if a function passed, the rendered of the children can be overridden */
  children: PropTypes.any,
  canvases: PropTypes.array,
  toolbar: PropTypes.any,
  selectedCanvases: PropTypes.array,
};

CanvasList.defaultProps = {
  selectedCanvases: [],
};

export default CanvasList;
