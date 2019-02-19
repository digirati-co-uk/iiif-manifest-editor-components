import React from 'react';
import PropTypes from 'prop-types';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

const ManifestEditorAppBar = ({ title, titleColor, children }) => (
  <AppBar position="static">
    <Toolbar>
      <Typography color={titleColor} variant="h6">
        {title}
      </Typography>
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'canter',
          justifyContent: 'flex-end',
        }}
      >
        {children}
      </div>
    </Toolbar>
  </AppBar>
);

ManifestEditorAppBar.propTypes = {
  title: PropTypes.string.isRequired,
  titleColor: PropTypes.string.isRequired,
  children: PropTypes.any,
};

ManifestEditorAppBar.defaultProps = {
  title: 'Manifest Editor',
  titleColor: 'secondary',
};

export default ManifestEditorAppBar;
