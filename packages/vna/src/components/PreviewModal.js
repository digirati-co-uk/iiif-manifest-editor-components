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
import { FullPageViewer } from '@canvas-panel/full-page-plugin';
import { SlideShow } from '@canvas-panel/slideshow';
import  { saveFixtures } from '../utils';

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
        manifest.behavior.filter(behavior=>behavior==='vam-annotated-zoom').length>0 
        ? (
          <FullPageViewer
            jsonLd={saveFixtures(manifest)}
            title="Preview"
            annotationPosition="top"
          >
            <p>Scroll down to start or click the 'start tour' button.</p>
            <span className="muted">
              © Victoria and Albert Museum, London 2018
            </span>
          </FullPageViewer>
          // <PatchworkPlugin
          //   jsonLdManifest={saveFixtures(manifest)}
          //   cssClassMap={{
          //     annotation: 'annotation-pin',
          //   }}
          //   cssClassPrefix="patchwork-"
          //   height={500}
          //   width={1200}
          // />
        )
        : (
          <SlideShow jsonLd={manifest} />
        )
      }
    </div>
  </Dialog>
);

export default PreviewModal;