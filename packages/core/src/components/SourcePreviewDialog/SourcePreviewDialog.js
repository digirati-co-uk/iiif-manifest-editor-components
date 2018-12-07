import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core';

const SourcePreviewDialog = ({ json, open, handleClose }) => (
  <Dialog
    open={open}
    onClose={handleClose}
    scroll="paper"
    maxWidth="md"
    aria-labelledby="preview-dialog-title"
  >
    <DialogTitle id="preview-dialog-title">JSON Preview</DialogTitle>
    <DialogContent>
      <pre>
        <code>{JSON.stringify(json, null, 2)}</code>
      </pre>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

SourcePreviewDialog.propTypes = {
  json: PropTypes.any,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
};

SourcePreviewDialog.defaultProps = {
  json: {},
  open: false,
  handleClose: () => {},
};

export default SourcePreviewDialog;
