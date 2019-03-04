import * as React from 'react';
import * as PropTypes from 'prop-types';

import { withStyles, Divider, Typography } from '@material-ui/core';
import { ArrowForwardIos } from '@material-ui/icons';

import IMG from './IIIFCollectionExplorer.IMG';
import LocaleString from '../LocaleString/LocaleString';
import { getCollectionThumbnail } from './IIIFCollectionExplorer.utils';

const style = theme => ({
  list: {
    display: 'flex',
    flexWrap: 'wrap',
    overflowX: 'hidden',
    overflowY: 'auto',
    position: 'relative',
  },
  listItem: {
    display: 'block',
    width: '100%',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  info: {
    width: 'calc(100% - 140px)',
    padding: theme.spacing.unit,
  },
  infoLong: {
    width: 'calc(100% - 40px)',
    padding: theme.spacing.unit,
  },
  moreVert: {
    width: 40,
    minHeight: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnail: {
    width: 100,
  },
  placeholder: {
    display: 'flex',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    width: '100%',
  },
});

const CollectionLister = ({ classes, items, openItem }) => (
  <div className={classes.list}>
    {items.map(item => {
      const thumbnail = getCollectionThumbnail(item);
      return (
        <div
          key={item.id}
          onClick={() => openItem(item)}
          className={classes.listItem}
        >
          <div className={classes.moreVert}>
            <ArrowForwardIos />
          </div>
          <div className={thumbnail ? classes.info : classes.infoLong}>
            <Typography component="h5" variant="h5">
              <LocaleString>{item.label}</LocaleString>
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {item.type}
            </Typography>
          </div>
          {thumbnail && (
            <IMG src={thumbnail} alt={item.id} className={classes.thumbnail} />
          )}
          <Divider className={classes.divider} />
        </div>
      );
    })}
  </div>
);

export default withStyles(style)(CollectionLister);
