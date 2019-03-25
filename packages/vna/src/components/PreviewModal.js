import * as React from 'react';
import { useState } from 'react';
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
  Close,
  Fullscreen,
  Web,
} from '@material-ui/icons';
import { FullPageViewer } from '@canvas-panel/full-page-plugin';
import { PatchworkPlugin } from '@canvas-panel/patchwork-plugin';
import { SlideShow } from '@canvas-panel/slideshow';
import { saveFixtures } from '../utils';
import PreviewInPageContext from './PreviewInPageContext';
import './Preview/Patchwork.css';

const RenderManifest = ({manifest, isDemoPage}) => {
  const isAnnotatedZoom = 
    manifest && 
    manifest.behavior && 
    manifest.behavior.filter(behavior=>behavior==='vam-annotated-zoom').length>0;

  if (isAnnotatedZoom && isDemoPage) {
    return (
      <FullPageViewer
        jsonLd={manifest}
        title="Preview"
        annotationPosition="top"
      >
        <p>Scroll down to start or click the 'start tour' button.</p>
        <span className="muted">
          © Victoria and Albert Museum, London {new Date().getYear()}
        </span>
      </FullPageViewer>
    );
  } else if (isAnnotatedZoom && !isDemoPage) {
    return (
      <div className="patchwork-container">
        <PatchworkPlugin
          jsonLdManifest={manifest}
          cssClassMap={{
            annotation: 'annotation-pin',
          }}
          cssClassPrefix="patchwork-"
          height={500}
          width={1200}
        />
      </div>
    );
  } else {
    return (
      <SlideShow jsonLd={manifest} />
    );
  }
};
  

const PreviewModal = ({ manifest, handleClose, open }) => {
  const [isPage, setIsPage] = useState(false);
  const _manifest = saveFixtures(manifest);
  return (
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
          <IconButton onClick={()=>setIsPage(!isPage)} color="inherit" aria-label={isPage ? "Web" : "Fullscreen"}>
            {isPage ? (
              <React.Fragment>
                <Web />
                <Typography variant="h6" color="inherit">Show In context</Typography
              ></React.Fragment>
            ): (
              <React.Fragment>
                <Fullscreen />
                <Typography variant="h6" color="inherit">FullPage</Typography>
              </React.Fragment>
            )}
          </IconButton>
        </Toolbar>
      </AppBar>
      {isPage 
        ? (
          <div style={{flex: 1, width: '100%'}}>
            <RenderManifest manifest={_manifest} isDemoPage={isPage}/>
          </div>
        ) : (
          <PreviewInPageContext>
            <RenderManifest manifest={_manifest} />
          </PreviewInPageContext>
        )}
    </Dialog>
  );
}

export default PreviewModal;