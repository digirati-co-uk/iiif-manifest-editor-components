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
import { IIIFCollectionExplorer } from '@IIIF-MEC/core';

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
}) => {
  const manifestId = manifest.id;
  const folderUrl = manifestId.substring(0, manifestId.lastIndexOf("/") + 1);
  const fileName = manifestId.substring(manifestId.lastIndexOf("/") + 1, manifestId.length);
  const [url, setURL ] = useState(folderUrl);
  const [file, setFile] = useState(fileName);
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
          <TextField label="Manifest Name" defaultValue={fileName} onChange={(ev=>setFile(ev.target.value))}/>
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
                  .then(() => handleClose())
                  .catch(error => alert(error));
                return true;
              } else if (resource.type === 'Collection') {
                setURL(resource.id);
              }
            })
          }
          onResourceLoaded={loadedResourceURL => setURL(loadedResourceURL)}
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
                  body: JSON.stringify(manifest)
              })
                .then(response => response.json())
                .then(() => handleClose())
                .catch(error => alert(error));
            });
        }} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}


export default withStyles(style)(SaveManifestModal);