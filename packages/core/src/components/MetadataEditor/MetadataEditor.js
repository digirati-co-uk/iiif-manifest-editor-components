import React from 'react';
import PropTypes from 'prop-types';

const MetadataEditor = ({ manifest, canvas, annotation, lang }) => (
  <div>MetadataEditor</div>
);

MetadataEditor.propTypes = {
  /** The loaded manifest */
  manifest: PropTypes.object,
  /** Selected canvas */
  canvas: PropTypes.object,
  /** Selected annotation */
  annotation: PropTypes.object,
  /** Language */
  lang: PropTypes.string,
};

MetadataEditor.defaultProps = {
  manifest: null,
  canvas: null,
  annotation: null,
  lang: 'en',
};

export default MetadataEditor;
