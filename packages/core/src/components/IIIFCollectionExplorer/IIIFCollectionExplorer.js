import * as React from 'react';
import * as PropTypes from 'prop-types';
import {
  withStyles,
  CircularProgress,
} from '@material-ui/core';

import convertToV3ifNecessary from '../../utils/IIIFUpgrader';
import NavBar from './IIIFCollectionExplorer.NavBar';
import CanvasList from './IIIFCollectionExplorer.CanvasList';
import CollectionLister from './IIIFCollectionExplorer.CollectionLister';
import ErrorDialog from './IIIFCollectionExplorer.ErrorDialog';

const isManifestOrCollection = resource =>
  resource.type === 'Collection' || resource.type === 'Manifest';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    //height: '100%',
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
    // manifestIcon: null,
    // collectionIcon: null,
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

  prepareHistory = (url) => {
    let history = this.state.history;
    const resourceUrlIndex = history.indexOf(url);
    if (resourceUrlIndex !== -1) {
      history = history.slice(0, resourceUrlIndex);
    }
    return history;
  };

  //TODO: CORS proxy
  loadResource = url => {
    if (url === '' || url === this.state.loadedResourceURL) {
      return;
    }
    this.setState({
      isLoading: true,
    });
    fetch(url)
      .then(this.responseToResource)
      .then(resource => convertToV3ifNecessary(resource))
      .then(this.resourceLoaded(url))
      .catch(this.resourceLoadError(url));
  };

  resourceLoadError = url => err =>
    this.setState({
      isLoading: false,
      error: `Failed to load ${url}.`,
    });

  responseToResource = response => {
    if (!response.ok) { 
      throw `[${response.status}] ${response.statusText}`;
    }
    return response.json();
  };

  resourceLoaded = url => resource => {
    if (
      !this.props.autoSelectIfManifestFromUrl ||
      (this.props.autoSelectIfManifestFromUrl &&
        !this.props.onItemSelect({
          type: resource.type,
          id: url,
        }))
    ) {
      const history = this.prepareHistory(url);
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

  getItems = resource => 
    resource && isManifestOrCollection(resource) && resource.items
      ? resource.items
      : [];

  renderList = () => {
    const { resource } = this.state;
    const { 
      autoSelectIfManifestFromUrl,
      manifestIcon,
      collectionIcon,
      canvasListDroppableId,
    } = this.props;
    const items = this.getItems(resource);
    if (resource &&
      resource.type === 'Manifest' &&
      !autoSelectIfManifestFromUrl) {
        return (
          <CanvasList
            items={items}
            manifestId={resource.id}
            droppableId={canvasListDroppableId}
          />
        ); 
    }
    return (
      <CollectionLister
        items={items}
        openItem={this.openItem}
        manifestIcon={manifestIcon}
        collectionIcon={collectionIcon}
      />
    )
  }

  render() {
    const {
      classes,
      style,
    } = this.props;
    const {
      history,
      loadedResourceURL,
      isLoading,
      resourceURL,
      error,
    } = this.state;

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
        ) : this.renderList()}
        <ErrorDialog error={error} handleCloseErrorDialog={this.handleCloseErrorDialog} />
      </div>
    );
  }
}

CollectionExplorer.propTypes = {
  url: PropTypes.string,
  onItemSelect: PropTypes.func,
  autoSelectIfManifestFromUrl: PropTypes.bool,
  canvasListDroppableId: PropTypes.string,
  onResourceLoaded: PropTypes.func,
  manifestIcon: PropTypes.any,
  collectionIcon: PropTypes.any,
};

CollectionExplorer.defaultProps = {
  url: '',
  onItemSelect: () => {},
  onResourceLoaded: () => {},
  manifestIcon: undefined,
  collectionIcon: undefined,
  autoSelectIfManifestFromUrl: false,
  canvasListDroppableId: 'iiifimagelist',
};

export default withStyles(styles)(CollectionExplorer);
