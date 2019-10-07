import * as React from 'react';
import { useState } from 'react';
import * as PropTypes from 'prop-types';
import {
  withStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@material-ui/core';
import { LibraryBooks } from '@material-ui/icons';
import { IIIFCollectionExplorer } from '@iiif-mec/core';
import { saveFixtures } from '../utils';

const style = theme => ({
  titleBar: {
    padding: theme.spacing.unit,
  },
});

const SaveManifestModal = ({
  classes,
  manifest,
  regenerateIds,
  open,
  handleClose,
  enqueueSnackbar,
}) => {
  let manifestId = manifest.id;
  // UX asked to modify the save id in order to get a proper folder whilst you saving.
  // TODO: the final solution for these situations would be a custom/pluggable id
  // generator, but that's currently far outside the scope.
  if (manifestId.endsWith('/manifest')) {
    manifestId = manifestId.replace('/manifest', '') + '.json';
  }
  const folderUrl = manifestId.substring(0, manifestId.lastIndexOf('/') + 1);
  const fileName = manifestId.substring(
    manifestId.lastIndexOf('/') + 1,
    manifestId.length
  );
  const [url, setURL] = useState(folderUrl);
  const [file, setFile] = useState(fileName);
  const didSave = () => {
    //this is temporary until the persistence module fully developed
    window.lastPersist = new Date().getTime();
    handleClose();
    enqueueSnackbar('Save successful.', { variant: 'success' });
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="paper"
      maxWidth="lg"
      fullWidth={true}
      aria-labelledby="load-manifest-dialog-title"
    >
      <DialogTitle id="load-manifest-dialog-title">Save Manifest</DialogTitle>
      <DialogContent>
        <div className={classes.titleBar}>
          <TextField
            label="Manifest Name"
            defaultValue={fileName}
            onChange={ev => setFile(ev.target.value)}
            style={{ width: '50%' }}
          />
        </div>
        <IIIFCollectionExplorer
          url={folderUrl}
          onItemSelect={resource => {
            if (resource.type === 'Manifest') {
              fetch(resource.id, {
                method: 'post',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(saveFixtures(manifest)),
              })
                .then(response => response.json())
                .then(didSave)
                .catch(error => enqueueSnackbar(error, { variant: 'error' }));
              return true;
            } else if (resource.type === 'Collection') {
              setURL(resource.id);
            }
          }}
          onResourceLoaded={loadedResourceURL => setURL(loadedResourceURL)}
          manifestIcon={LibraryBooks}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            const saveTolUrl = file.endsWith('.json')
              ? url + file
              : url + file + '.json';
            regenerateIds(saveTolUrl, () => {
              fetch(saveTolUrl, {
                method: 'post',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(saveFixtures(manifest)),
              })
                .then(response => response.json())
                .then(didSave)
                .catch(error => enqueueSnackbar(error, { variant: 'error' }));
            });
          }}
          color="primary"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

SaveManifestModal.protoTypes = {
  /** JSS classes */
  classes: PropTypes.object,
  /** The manifest going to be saved */
  manifest: PropTypes.any,
  /** the function provides extra protection against id collision */
  regenerateIds: PropTypes.func,
  /** is modal open  */
  open: PropTypes.bool,
  /** close handler */
  handleClose: PropTypes.func,
  /** if passed a snackbar will be presented after both successful and unsuccessful actions */
  enqueueSnackbar: PropTypes.func,
};

SaveManifestModal.defaultProps = {
  open: false,
  enqueueSnackbar: () => {},
  handleClose: () => {},
  regenerateIds: () => {},
};

export default withStyles(style)(SaveManifestModal);
