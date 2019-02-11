import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  withStyles,
} from '@material-ui/core';

//TODO: Error handling...

const style = theme => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: 680,
  },
});

const DefaultLoadManifestDialog = ({
  classes,
  loadManifest,
  open,
  handleClose,
}) => (
  <Dialog
    open={open}
    onClose={handleClose}
    scroll="paper"
    maxWidth="md"
    aria-labelledby="preview-dialog-title"
  >
    <DialogTitle id="preview-dialog-title">Open Manifest</DialogTitle>
    <DialogContent>
      <form id="manifest_form" className={classes.form}>
        <TextField
          label="Type a IIIF Manifest Url"
          margin="dense"
          variant="outlined"
          name="manifestUrl"
          type="url"
        />
        <TextField
          label="Or paste the IIIF Manifest Body"
          margin="dense"
          multiline
          variant="outlined"
          name="manifestBody"
          type="text"
          rowsMax={20}
        />
      </form>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">
        Close
      </Button>
      <Button
        onClick={ev => {
          ev.preventDefault();
          /* this part should be an action */
          const manifestUrl = document.forms.manifest_form.manifestUrl.value;
          const manifestBody = document.forms.manifest_form.manifestBody.value;
          if (manifestUrl !== '') {
            fetch(manifestUrl)
              .then(response => response.json())
              .then(response => loadManifest(response))
              .catch(error => alert(error));
          } else if (manifestBody !== '') {
            loadManifest(JSON.parse(manifestBody));
          }
        }}
        color="primary"
      >
        Open
      </Button>
    </DialogActions>
  </Dialog>
);

DefaultLoadManifestDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  loadManifest: PropTypes.func,
};

DefaultLoadManifestDialog.defaultProps = {
  open: false,
  handleClose: () => {},
  loadManifest: () => {},
};

export default withStyles(style)(DefaultLoadManifestDialog);
