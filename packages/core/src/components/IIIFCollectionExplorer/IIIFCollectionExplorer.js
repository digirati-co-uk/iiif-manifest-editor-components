import * as React from 'react';
import * as PropTypes from 'prop-types';
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
    manifestIcon: null,
    collectionIcon: null,
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
      fetch(url.replace(/^https?\:\/\//, '//'))
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
          if (
            !this.props.autoSelectIfManifestFromUrl ||
            (this.props.autoSelectIfManifestFromUrl &&
              !this.props.onItemSelect(resource))
          ) {
            this.setState(
              {
                resource,
                loadedResourceURL: url,
                resourceURL: url,
                isLoading: false,
                history: history.concat([url]),
              },
              () => {
                this.props.onResourceLoaded(url);
              }
            );
          }
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
      if (!this.props.onItemSelect(item)) {
        this.loadResource(item.id);
      }
    }
  };

  handleCloseErrorDialog = () => {
    this.setState({
      error: false,
    });
  };

  render() {
    const { classes, style, manifestIcon, collectionIcon } = this.props;
    const {
      history,
      loadedResourceURL,
      isLoading,
      resourceURL,
      resource,
      error,
    } = this.state;

    const collectionListExtraProps = {};
    if (manifestIcon) {
      collectionListExtraProps.manifestIcon = manifestIcon;
    }
    if (collectionIcon) {
      collectionListExtraProps.collectionIcon = collectionIcon;
    }

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
          <CollectionLister
            items={items}
            openItem={this.openItem}
            {...collectionListExtraProps}
          />
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
  onItemSelect: PropTypes.func,
  autoSelectIfManifestFromUrl: PropTypes.bool,
  onResourceLoaded: PropTypes.func,
  manifestIcon: PropTypes.any,
  collectionIcon: PropTypes.any,
};

CollectionExplorer.defaultProps = {
  url: '',
  onItemSelect: () => {},
  onResourceLoaded: () => {},
  manifestIcon: null,
  collectionIcon: null,
  autoSelectIfManifestFromUrl: false,
};

export default withStyles(styles)(CollectionExplorer);
