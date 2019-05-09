import * as React from 'react';
import * as PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';

import Tooltip from '../DefaultTooltip/DefaultTooltip';

const emptyFn = () => {};

const ButtonWithTooltip = ({
  title,
  children,
  onClick = emptyFn,
  ...props
}) => (
  <Tooltip title={title}>
    <div>
      <IconButton onClick={onClick} {...props}>
        {children}
      </IconButton>
    </div>
  </Tooltip>
);

ButtonWithTooltip.propTypes = {
  /** Tooltip title */
  title: PropTypes.string,
  /** Icon or svg */
  children: PropTypes.any,
  /**  click handler */
  onClick: PropTypes.func,
};

export default ButtonWithTooltip;
