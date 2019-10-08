import * as React from 'react';
import * as PropTypes from 'prop-types';
import ManifestEditorDialog from '../ManifestEditorDialog/ManifestEditorDialog';

const SourcePreviewDialog = ({ json, open, handleClose }) => (
  <ManifestEditorDialog
    open={open}
    handleClose={handleClose}
    title="JSON Preview"
  >
    <pre>
      <code>{JSON.stringify(json, null, 2)}</code>
    </pre>
  </ManifestEditorDialog>
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
