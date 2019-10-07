import * as React from 'react';
import * as PropTypes from 'prop-types';
import {
  Button,
  TextField,
  withStyles,
} from '@material-ui/core';
import ManifestEditorDialog from '../ManifestEditorDialog/ManifestEditorDialog'

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
  <ManifestEditorDialog
    open={open}
    handleClose={handleClose}
    title="Open Manifest"
    actions={
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
    }
  >
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
  </ManifestEditorDialog>
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
