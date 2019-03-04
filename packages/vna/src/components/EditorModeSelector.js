import React from 'react';
import { Select , MenuItem, withStyles } from '@material-ui/core';

const style = theme => {
  console.log('theme', theme);
  return ({
    input: {
      color: theme.palette.secondary.main
    },
    icon: {
      fill: theme.palette.secondary.main
    },
  })
};

const EditorModeSelector = ({ classes, selected, onSelect }) => (
  <Select 
    value={selected}
    onChange={onSelect}
    label="editor version"
    margin="none"
    variant="outlined"
    inputProps={{
      className: classes.input
    }}
    classes={{
      icon: classes.icon,
    }}
  >
    <MenuItem value="default">IIIF Manifest Editor (No extension)</MenuItem>
    <MenuItem value="patchwork">Patchwork Editor</MenuItem>
    <MenuItem value="slideshow">Slideshow Editor</MenuItem>
  </Select>
);

export default withStyles(style)(EditorModeSelector);
