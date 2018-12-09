import React from 'react';
import PropTypes from 'prop-types';
import { Toolbar, IconButton } from '@material-ui/core';
import { Image, Videocam, Audiotrack, Notes } from '@material-ui/icons';
import Tooltip from '../DefaultTooltip/DefaultTooltip';

const DefaultAnnotationListToolbar = ({ invokeAction }) => (
  <Toolbar
    color="secondary"
    style={{
      justifyContent: 'center',
    }}
  >
    <Tooltip title="Add Text Annotation (motivation: painting)">
      <IconButton onClick={() => invokeAction('add-text-annotation')}>
        <Notes />
      </IconButton>
    </Tooltip>
    <Tooltip title="Add Image Annotation">
      <IconButton onClick={() => invokeAction('add-image-annotation')}>
        <Image />
      </IconButton>
    </Tooltip>
    <Tooltip title="Add Video Annotation">
      <IconButton onClick={() => invokeAction('add-video-annotation')}>
        <Videocam />
      </IconButton>
    </Tooltip>
    <Tooltip title="Add Audio Annotation">
      <IconButton onClick={() => invokeAction('add-audio-annotation')}>
        <Audiotrack />
      </IconButton>
    </Tooltip>
  </Toolbar>
);

DefaultAnnotationListToolbar.propTypes = {
  doAction: PropTypes.func.isRequired,
};

DefaultAnnotationListToolbar.defaultProps = {
  doAction: () => {},
};

export default DefaultAnnotationListToolbar;
