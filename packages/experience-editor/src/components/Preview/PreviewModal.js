import * as React from 'react';
import * as PropTypes from 'prop-types';
import { useState } from 'react';
import {
  withStyles,
  Dialog,
  Button,
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { Close, Fullscreen, Web } from '@material-ui/icons';
import { saveFixtures } from '../../utils';
import PreviewInPageContext from './PreviewInPageContext';
import RenderManifest from './RenderManifestPreview';
import './Patchwork.css';

const styles = theme => ({
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

const PreviewModal = ({ classes, manifest, handleClose, open }) => {
  const [isPage, setIsPage] = useState(false);
  const _manifest = saveFixtures(manifest);
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="paper"
      fullScreen
      aria-labelledby="load-manifest-dialog-title"
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit" style={{ flexGrow: 1 }}>
            Preview
          </Typography>
          <Button
            onClick={() => setIsPage(!isPage)}
            color="inherit"
            aria-label={isPage ? 'Web' : 'Fullscreen'}
          >
            {isPage ? (
              <React.Fragment>
                <Web className={classes.leftIcon} />
                <Typography variant="h6" color="inherit">
                  Show In context
                </Typography>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Fullscreen className={classes.leftIcon} />
                <Typography variant="h6" color="inherit">
                  FullPage
                </Typography>
              </React.Fragment>
            )}
          </Button>
          <Button color="inherit" onClick={handleClose} aria-label="Close">
            <Close className={classes.leftIcon} />
            <Typography variant="h6" color="inherit">
              Close Preview
            </Typography>
          </Button>
        </Toolbar>
      </AppBar>
      {isPage ? (
        <div style={{ flex: 1, width: '100%' }}>
          <RenderManifest manifest={_manifest} isDemoPage={isPage} />
        </div>
      ) : (
        <PreviewInPageContext>
          <RenderManifest manifest={_manifest} />
        </PreviewInPageContext>
      )}
    </Dialog>
  );
};

export default withStyles(styles)(PreviewModal);
