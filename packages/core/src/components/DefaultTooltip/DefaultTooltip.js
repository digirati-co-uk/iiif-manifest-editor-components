import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@material-ui/core';

const DefaultTooltip = ({ children, ...props }) => (
  <Tooltip {...props} aria-label={props.title}>
    {children}
  </Tooltip>
);

DefaultTooltip.defaultProps = {
  title: '',
  placement: 'top',
  enterDelay: 500,
  leaveDelay: 200,
};

DefaultTooltip.propTypes = {
  title: PropTypes.string.isRequired,
  placement: PropTypes.string,
  enterDelay: PropTypes.number,
  leaveDelay: PropTypes.number,
};

export default DefaultTooltip;
