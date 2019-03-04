import * as React from 'react';
import * as PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core';
import { IIIFCollectionExplorer } from '@IIIF-MEC/core';


const LoadManifestModal = ({ 
  collectionURL, 
  open, 
  handleClose, 
  loadManifest 
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="paper"
      maxWidth="lg"
      fullWidth={true}
      aria-labelledby="load-manifest-dialog-title"
    >
      <DialogTitle id="load-manifest-dialog-title">Load Manifest</DialogTitle>
      <DialogContent>
        <IIIFCollectionExplorer url={collectionURL} onItemSelect={(resource=>{
          if (resource.type === "Manifest") {
            fetch(resource.id)
              .then(response => response.json())
              .then(response => loadManifest(response))
              .catch(error => alert(error));
            return true;
          }
        })}/>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
  

export default LoadManifestModal;