import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@material-ui/core';

const DefaultLoadManifestDialog = ({ loadManifest, open, handleClose }) => (
  <Dialog
    open={open}
    onClose={handleClose}
    scroll="paper"
    maxWidth="md"
    aria-labelledby="preview-dialog-title"
  >
    <DialogTitle id="preview-dialog-title">Open Manifest</DialogTitle>
    <DialogContent>
      <form
        id="manifest_form"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 680,
        }}
      >
        <TextField
          label="Type a IIIF Manifest Url"
          //className={classes.textField}
          margin="dense"
          variant="outlined"
          name="manifestUrl"
          type="url"
        />
        <TextField
          label="Or paste the IIIF Manifest Body"
          //className={classes.textField}
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

export default DefaultLoadManifestDialog;
