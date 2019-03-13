import * as React from 'react';
import {
  withStyles,
  Dialog,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  CloseIcon,
  Typography
} from '@material-ui/core';
import {
  Close
} from '@material-ui/icons';
import { PatchworkPlugin } from '@canvas-panel/patchwork-plugin';
import { SlideShow } from '@canvas-panel/slideshow';

const PreviewModal = ({ manifest, handleClose, open }) => (
  <Dialog
    open={open}
    onClose={handleClose}
    scroll="paper"
    fullScreen
    aria-labelledby="load-manifest-dialog-title"
    style={{display: 'flex', flexDirection: 'column', }}
  >
    <AppBar position="static">
      <Toolbar>
        <IconButton color="inherit" onClick={handleClose} aria-label="Close">
          <Close />
        </IconButton>
        <Typography variant="h6" color="inherit" >
          Preview Experience
        </Typography>
      </Toolbar>
    </AppBar>
    <div style={{flex: 1, width: '100%'}}>
      {
        manifest && 
        manifest.behavior && 
        manifest.behavior.filter(behavior=>behavior==='annotated-zoom').length>0 
        ? (
          <PatchworkPlugin
            jsonLd={manifest}
            cssClassMap={{
              annotation: 'annotation-pin',
            }}
            cssClassPrefix="patchwork-"
            height={500}
            width={1200}
          />
        )
        : (
          <SlideShow jsonLd={manifest} />
        )
      }
    </div>
  </Dialog>
);

export default PreviewModal;