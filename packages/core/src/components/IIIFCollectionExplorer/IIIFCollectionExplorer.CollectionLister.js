import * as React from 'react';
import * as PropTypes from 'prop-types';

import { withStyles, Divider, Typography } from '@material-ui/core';
import { ArrowForwardIos } from '@material-ui/icons';

import IMG from './IIIFCollectionExplorer.IMG';
import LocaleString from '../LocaleString/LocaleString';
import { getCollectionThumbnail } from './IIIFCollectionExplorer.utils';
import style from './IIIFCollectionExplorer.CollectionLister.styles';

class CollectionLister extends React.Component {

  getIconForType = itemType => {
    const { manifestIcon, collectionIcon } = this.props;
    if (itemType === 'Manifest') {
      return manifestIcon;
    } else if (itemType === 'Collection') {
      return collectionIcon;
    }
    return ArrowForwardIos;
  };

  getInfoBlockClass = thumbnail => {
    const { classes } = this.props;
    return thumbnail ? classes.info : classes.infoLong;
  }

  renderImageForThumbnail = (thumbnail, altText) => {
    return thumbnail && (
      <IMG src={thumbnail} alt={altText} className={this.props.classes.thumbnail} />
    );
  } 
    

  renderCollectionItem = item => {
    const { openItem, classes } = this.props;
    const thumbnail = getCollectionThumbnail(item);
    const icon = this.getIconForType(item.type);
    return (
      <div
        key={item.id}
        onClick={() => openItem(item)}
        className={classes.listItem}
      >
        <div className={classes.moreVert}>{React.createElement(icon)}</div>
        <div className={this.getInfoBlockClass(thumbnail)}>
          <Typography component="h5" variant="h5">
            <LocaleString>{item.label}</LocaleString>
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {item.type}
          </Typography>
        </div>
        {this.renderImageForThumbnail(thumbnail, item.id)}
        <Divider className={classes.divider} />
      </div>
    );
  };
  
  render() {
    const {
      classes,
      items,
    } = this.props;
    return (
      <div className={classes.list}>
        {items.map(this.renderCollectionItem)}
      </div>
    );
  }
};

CollectionLister.propTypes = {
  /** manifest icon, icon class can be passed */
  manifestIcon: PropTypes.elementType,
  /** collection icon, icon class can be passed */
  collectionIcon: PropTypes.elementType,
  /** items in the collection */
  items: PropTypes.array,
};

CollectionLister.defaultProps = {
  manifestIcon: ArrowForwardIos,
  collectionIcon: ArrowForwardIos,
  items: [],
};

export default withStyles(style)(CollectionLister);
