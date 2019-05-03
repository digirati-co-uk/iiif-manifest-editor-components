import * as React from 'react';
import * as PropTypes from 'prop-types';
import { AppBar, Toolbar, Typography, withStyles } from '@material-ui/core';


const styles = theme => ({
  actions: {
    flex: 1,
    display: 'flex',
    alignItems: 'canter',
    justifyContent: 'flex-end',
  }
})

const ManifestEditorAppBar = ({
  title,
  titleComponent,
  titleColor,
  children,
  classes,
}) => (
  <AppBar position="static">
    <Toolbar>
      {titleComponent ? (
        titleComponent
      ) : (
        <Typography color={titleColor} variant="h6">
          {title}
        </Typography>
      )}
      <div className={classes.actions} >
        {children}
      </div>
    </Toolbar>
  </AppBar>
);

ManifestEditorAppBar.propTypes = {
  title: PropTypes.string.isRequired,
  titleColor: PropTypes.string.isRequired,
  titleComponent: PropTypes.any,
  children: PropTypes.any,
};

ManifestEditorAppBar.defaultProps = {
  title: 'Manifest Editor',
  titleColor: 'secondary',
  titleComponent: null,
};

export default withStyles(styles)(ManifestEditorAppBar);
