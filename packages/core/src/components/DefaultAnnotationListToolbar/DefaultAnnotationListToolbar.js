import React from 'react';
import PropTypes from 'prop-types';
import { Toolbar, IconButton } from '@material-ui/core';
import { Image, Videocam, Audiotrack, Notes } from '@material-ui/icons';

const DefaultAnnotationListToolbar = ({ invokeAction }) => (
  <Toolbar
    color="secondary"
    style={{
      justifyContent: 'center',
    }}
  >
    <IconButton onClick={() => invokeAction('add-text-annotation')}>
      <Notes />
    </IconButton>
    <IconButton onClick={() => invokeAction('add-image-annotation')}>
      <Image />
    </IconButton>
    <IconButton onClick={() => invokeAction('add-video-annotation')}>
      <Videocam />
    </IconButton>
    <IconButton onClick={() => invokeAction('add-audio-annotation')}>
      <Audiotrack />
    </IconButton>
  </Toolbar>
);

DefaultAnnotationListToolbar.propTypes = {
  doAction: PropTypes.func.isRequired,
};

DefaultAnnotationListToolbar.defaultProps = {
  doAction: () => {},
};

export default DefaultAnnotationListToolbar;
