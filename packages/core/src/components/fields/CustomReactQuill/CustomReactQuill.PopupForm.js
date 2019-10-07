import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import styles from './CustomReactQuill.PopupForm.styles';

const CustomReactQuillPopupForm = ({ open, children, classes }) => (
  <div
    style={{
      display: open ? 'flex' : 'none',
    }}
    className={classes.root}
  >
    <div className={classes.content}>
      {children}
    </div>
  </div>
);

CustomReactQuillPopupForm.propTypes = {
  open: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  classes: PropTypes.object,
};

export default withStyles(styles)(CustomReactQuillPopupForm);