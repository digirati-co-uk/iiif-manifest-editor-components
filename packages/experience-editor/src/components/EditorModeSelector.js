import React from 'react';
import * as PropTypes from 'prop-types';
import { Select, MenuItem, withStyles } from '@material-ui/core';

const style = theme => {
  return {
    input: {
      color: theme.palette.secondary.main,
    },
    icon: {
      fill: theme.palette.secondary.main,
    },
  };
};

const EditorModeSelector = ({ classes, selected, onSelect }) => (
  <Select
    value={selected}
    onChange={onSelect}
    label="editor mode"
    margin="none"
    variant="outlined"
    inputProps={{
      className: classes.input,
    }}
    classes={{
      icon: classes.icon,
    }}
  >
    <MenuItem value="slideshow">Slideshow Editor</MenuItem>
    <MenuItem value="annotated-zoom">Annotated Zoom</MenuItem>
    <MenuItem value="default">IIIF Manifest Editor (No extension)</MenuItem>
  </Select>
);

EditorModeSelector.propTypes = {
  /** jss classes  */
  classes: PropTypes.object,
  /** selected mode */
  selected: PropTypes.string,
  /** on select callback */
  onSelect: PropTypes.func,
};

export default withStyles(style)(EditorModeSelector);
