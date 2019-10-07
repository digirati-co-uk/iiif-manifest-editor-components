import * as React from 'react';
import * as PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core';

const createDialogIdFromTitle = title => 
  title
    .replace(/[^\w\s]+/g, '')
    .replace(/\s+/g,'-');

const ManifestEditorDialog = ({ 
  open,
  handleClose,
  title,
  closeLabel,
  children,
  actions,
  fullWidth,
  maxWidth,
}) => {
  const dialogId = createDialogIdFromTitle(title);
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="paper"
      maxWidth={maxWidth}
      aria-labelledby={dialogId}
      fullWidth={fullWidth}
    >
      <DialogTitle id={dialogId}>{title}</DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {closeLabel}
        </Button>
        {actions}
      </DialogActions>
    </Dialog>
  )
}

ManifestEditorDialog.propTypes = {
  /** is the dialog open */
  open: PropTypes.bool,
  /** close dialog handler */
  handleClose: PropTypes.func,
  /** close button label */
  closeLabel: PropTypes.string,
  /** dialog title */
  title: PropTypes.string,
  /** full width */
  fullWidth: PropTypes.bool,
};

ManifestEditorDialog.defaultProps = {
  closeLabel: 'Close',
  fullWidth: false,
  maxWidth: 'md'
}

export default ManifestEditorDialog