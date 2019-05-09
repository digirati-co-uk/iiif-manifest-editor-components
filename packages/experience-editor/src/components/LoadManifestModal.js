import * as React from 'react';
import * as PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core';
import { IIIFCollectionExplorer } from '@iiif-mec/core';
import { LibraryBooks } from '@material-ui/icons';

const LoadManifestModal = ({
  collectionURL,
  open,
  handleClose,
  loadManifest,
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
        <IIIFCollectionExplorer
          url={collectionURL}
          autoSelectIfManifestFromUrl={true}
          canvasListDroppableId="loadList"
          onItemSelect={resource => {
            if (resource.type === 'Manifest') {
              fetch(resource.id)
                .then(response => response.json())
                .then(response => loadManifest(response))
                .catch(error => alert(error));
              return true;
            }
          }}
          manifestIcon={LibraryBooks}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

LoadManifestModal.propTypes = {
  /** The starting point for the collection explorer components */
  collectionURL: PropTypes.string,
  /** is the modal open */
  open: PropTypes.bool,
  /** on close callback */
  handleClose: PropTypes.func,
  /** callback to load the manifest */
  loadManifest: PropTypes.func,
};

export default LoadManifestModal;
