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
  Snackbar,
} from '@material-ui/core';
import { LibraryBooks } from '@material-ui/icons';
import { IIIFCollectionExplorer } from '@IIIF-MEC/core';
import  { saveFixtures } from '../utils';
const style = theme => ({
  titleBar: {
    padding: theme.spacing.unit,
  }
})

const SaveManifestModal = ({ 
  manifest,
  regenerateIds, 
  open, 
  handleClose, 
  classes,
  enqueueSnackbar,
}) => {
  let manifestId = manifest.id;
  if (manifestId.endsWith('/manifest')) {
    manifestId = manifestId.replace('/manifest', '') + '.json';
  }
  const folderUrl = manifestId.substring(0, manifestId.lastIndexOf("/") + 1);
  const fileName = manifestId.substring(manifestId.lastIndexOf("/") + 1, manifestId.length);
  const [url, setURL ] = useState(folderUrl);
  const [file, setFile] = useState(fileName);
  const didSave = () => {
    window.lastPersist = new Date().getTime();
    handleClose();
    enqueueSnackbar('Save successful.', { variant: 'success'});
  }
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
          <TextField label="Manifest Name" defaultValue={fileName} onChange={(ev=>setFile(ev.target.value))} style={{width: '50%'}}/>
        </div>
        <IIIFCollectionExplorer 
          url={folderUrl} 
          onItemSelect={
            (resource=>{
              if (resource.type === "Manifest") {
                fetch(resource.id, {
                    method: 'post',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(manifest)
                })
                  .then(response => response.json())
                  .then(didSave)
                  .catch(error => enqueueSnackbar(error, { variant: 'error'}));
                return true;
              } else if (resource.type === 'Collection') {
                setURL(resource.id);
              }
            })
          }
          onResourceLoaded={loadedResourceURL => setURL(loadedResourceURL)}
          manifestIcon={LibraryBooks}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={() => {
            regenerateIds(url+file, () => {
              fetch(url+file, {
                  method: 'post',
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify(saveFixtures(manifest))
              })
                .then(response => response.json())
                .then(didSave)
                .catch(error => enqueueSnackbar(error, { variant: 'error'}));
            });
        }} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SaveManifestModal.defaultProps = {
  enqueueSnackbar: () => {},
};

export default withStyles(style)(SaveManifestModal);