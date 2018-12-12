import React from 'react';
import { IconButton } from '@material-ui/core';

import Tooltip from '../DefaultTooltip/DefaultTooltip';

const emptyFn = () => {};

const ButtonWithTooltip = ({ title, children, onClick = emptyFn }) => (
  <Tooltip title={title}>
    <IconButton onClick={onClick}>{children}</IconButton>
  </Tooltip>
);

export default ButtonWithTooltip;
