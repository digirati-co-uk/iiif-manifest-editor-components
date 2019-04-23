import * as React from 'react';
import * as PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Slide,
} from '@material-ui/core';

const ErrorDialog = ({ error, handleCloseErrorDialog }) => !!error && (
    <Dialog
      open={!!error}
      TransitionComponent={props => <Slide direction="up" {...props} />}
      onClose={handleCloseErrorDialog}
      aria-labelledby="error"
    >
      <DialogTitle>Error</DialogTitle>
      <DialogContent>
        <DialogContentText>{error}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseErrorDialog} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );

ErrorDialog.propTypes = {
  error: PropTypes.string,
  handleCloseErrorDialog: PropTypes.func,
};

ErrorDialog.defaultProps = {
  handleCloseErrorDialog: () => {},
};

export default ErrorDialog;