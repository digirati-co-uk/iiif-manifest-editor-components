import * as React from 'react';
import * as PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import DefaultTooltip from '../DefaultTooltip/DefaultTooltip';

const SlimAppBarButton = ({ text, onClick, icon }) => (
  <DefaultTooltip title={text} placement="bottom">
    <IconButton color="secondary" onClick={onClick}>
      {icon}
    </IconButton>
  </DefaultTooltip>
);

SlimAppBarButton.propTypes = {
  /* icon component used for the app bar button */
  icon: PropTypes.elementType,
  /* click event handler */
  onClick: PropTypes.func,
  /* button text */
  text: PropTypes.string,
}

export default SlimAppBarButton;