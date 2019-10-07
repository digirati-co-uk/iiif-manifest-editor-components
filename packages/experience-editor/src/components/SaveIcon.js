import * as React from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { Save, Forward } from '@material-ui/icons';

const SaveIcon = ({ classes }) => (
  <span className={classes.root}>
    <Save />
    <Forward 
      className={classes.subIcon}
    />
  </span>
);

SaveIcon.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(()=>({
  root: {
    position: 'relative',
    maxHeight: '24',
  },
  subIcon: {
    fill: '#000',
    transformOrigin: '50% 50%',
    transform: 'rotate(-90deg) scale(0.5)',
    top: '30%',
    left: '40%',
    position: 'absolute',
  }
}))(SaveIcon);