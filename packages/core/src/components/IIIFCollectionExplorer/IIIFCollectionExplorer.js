import React from 'react';
import PropTypes from 'prop-types';
import {
  withStyles,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Slide,
} from '@material-ui/core';

import convertToV3ifNecessary from '../../utils/IIIFUpgrader';
import NavBar from './IIIFCollectionExplorer.NavBar';
import CanvasList from './IIIFCollectionExplorer.CanvasList';
import CollectionLister from './IIIFCollectionExplorer.CollectionLister';

const isManifestOrCollection = resource =>
  resource.type === 'Collection' || resource.type === 'Manifest';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    minHeight: 300,
  },
  loadingIndicatorContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class CollectionExplorer extends React.Component {
  state = {
    resourceURL: '',
    loadedResourceURL: '',
    resource: null,
    isLoading: false,
    history: [],
    error: null,
  };

  constructor(props) {
    super(props);
    const { url } = this.props;
    if (url && url.length) {
      this.loadResource(url);
    }
  }

  onLoadResource = ev => this.loadResource(this.state.resourceURL);
  back = ev => this.loadResource(ev.target.value);

  //TODO: CORS proxy
  loadResource = url => {
    if (url !== '' && url !== this.state.loadedResourceURL) {
      this.setState({
        isLoading: true,
      });
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw `[${response.status}] ${response.statusText}`;
          }
          return response;
        })
        .then(response => response.json())
        .then(resource => convertToV3ifNecessary(resource))
        .then(resource => {
          let history = this.state.history;
          const resourceUrlIndex = history.indexOf(url);
          if (resourceUrlIndex !== -1) {
            history = history.slice(0, resourceUrlIndex);
          }
          this.setState({
            resource,
            loadedResourceURL: url,
            resourceURL: url,
            isLoading: false,
            history: history.concat([url]),
          });
        })
        .catch(err =>
          this.setState({
            isLoading: false,
            error: `Failed to load ${url}.`,
          })
        );
    }
  };

  onResourceUrlChange = ev => {
    this.setState({
      resourceURL: ev.target.value,
    });
  };

  openItem = item => {
    if (item.items) {
      this.setState({
        resource: item.items,
      });
    } else if (item.id) {
      this.loadResource(item.id);
    }
  };

  handleCloseErrorDialog = () => {
    this.setState({
      error: false,
    });
  };

  render() {
    const { classes, style } = this.props;
    const {
      history,
      loadedResourceURL,
      isLoading,
      resourceURL,
      resource,
      error,
    } = this.state;

    const items =
      resource && isManifestOrCollection(resource) && resource.items
        ? resource.items
        : []; // TODO: add empty result set

    return (
      <div className={classes.root} style={style}>
        <NavBar
          resourceURL={resourceURL}
          loadedResourceURL={loadedResourceURL}
          history={history}
          onResourceUrlChange={this.onResourceUrlChange}
          back={this.back}
          onLoadResource={this.onLoadResource}
        />
        {isLoading ? (
          <div className={classes.loadingIndicatorContainer}>
            <CircularProgress />
          </div>
        ) : resource && resource.type === 'Manifest' ? (
          <CanvasList items={items} manifestId={resource.id} />
        ) : (
          <CollectionLister items={items} openItem={this.openItem} />
        )}
        {!!error && (
          <Dialog
            open={!!error}
            TransitionComponent={props => <Slide direction="up" {...props} />}
            onClose={this.handleCloseErrorDialog}
            aria-labelledby="error"
          >
            <DialogTitle>Error</DialogTitle>
            <DialogContent>
              <DialogContentText>{error}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCloseErrorDialog} color="primary">
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </div>
    );
  }
}

CollectionExplorer.propTypes = {
  url: PropTypes.string,
};

CollectionExplorer.defaultProps = {
  url: '',
};

export default withStyles(styles)(CollectionExplorer);
