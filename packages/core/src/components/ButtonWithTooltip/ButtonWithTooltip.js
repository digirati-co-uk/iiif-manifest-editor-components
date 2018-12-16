import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';

import Tooltip from '../DefaultTooltip/DefaultTooltip';

const emptyFn = () => {};

const ButtonWithTooltip = ({ title, children, onClick = emptyFn }) => (
  <Tooltip title={title}>
    <IconButton onClick={onClick}>{children}</IconButton>
  </Tooltip>
);

ButtonWithTooltip.propTypes = {
  /* Tooltip title */
  title: PropTypes.string,
  /* Icon or svg */
  children: PropTypes.any,
  /* click handler */
  onClick: PropTypes.func,
};

export default ButtonWithTooltip;
