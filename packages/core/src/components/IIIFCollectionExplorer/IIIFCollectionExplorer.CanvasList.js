import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as PropTypes from 'prop-types';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import {
  withStyles,
  withTheme,
  Typography,
  CircularProgress,
  Divider,
} from '@material-ui/core';
import { LazyImage } from 'react-lazy-images';
import { List } from 'react-virtualized';
import ContainerDimensions from 'react-container-dimensions';

import LocaleString from '../LocaleString/LocaleString';
import { getCanvasThumbnail } from './IIIFCollectionExplorer.utils';
import IMG from './IIIFCollectionExplorer.IMG';

const tileSize = 100;

const styles = theme => {
  const spacer = theme.spacing.unit;
  return {
    droppable: {
      display: 'block',
      flex: 1,
      outline: 0,
    },
    draggable: {
      outline: 0,
    },
    list: {
      outline: 0,
    },
    listItem: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      padding: `${spacer}px ${spacer}px 0 ${spacer}px`,
    },
    imageHolder: {
      width: tileSize,
      height: tileSize,
    },
    divider: {
      width: '100%',
      marginTop: spacer,
    },
    rowContent: {
      flex: 1,
      padding: spacer,
    },
    thumbnail: {
      objectFit: 'contain',
      width: tileSize,
      height: tileSize,
    },
    placeholder: {
      display: 'flex',
      width: tileSize,
      height: tileSize,
      alignItems: 'center',
      justifyContent: 'center',
    },
  };
};

const PortalAwareThumbnail = ({
  provided,
  snapshot,
  thumbnail,
  useLazy,
  canvas,
  classes,
}) => {
  const usePortal = snapshot.isDragging;
  const child = (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      {useLazy ? (
        <LazyImage
          src={thumbnail}
          alt={canvas.id}
          placeholder={({ imageProps, ref }) => (
            <div ref={ref} className={classes.placeholder}>
              <CircularProgress />
            </div>
          )}
          actual={({ imageProps }) => <img {...imageProps} />}
        />
      ) : (
        <IMG
          src={thumbnail}
          alt={canvas.id}
          className={classes.thumbnail}
          size={tileSize}
        />
      )}
    </div>
  );

  if (snapshot.isDragging) {
    //TODO this is just temporary.
    window.draggedData = JSON.parse(JSON.stringify(canvas));
  }

  if (!usePortal) {
    return child;
  }
  const portal = document.querySelector('.drag-drop-portal');
  // if dragging - put the item in a portal
  return ReactDOM.createPortal(child, portal);
};

class CanvasList extends React.Component {
  rowRenderer = ({
    // Unique key within array of rows
    key,
    // Index of row within collection
    index,
    // The List is currently being scrolled
    isScrolling,
    // This row is visible within the List (eg it is not an overscanned row)
    isVisible,
    // Style object to be applied to row (to position it)
    style,
  }) => {
    const { classes, manifestId } = this.props;
    const canvas = this.props.items[index];
    // TODO: intelligent pre-fetcher to figure out is there sizes in info JSON,
    // if there's no sizes try request a size fit in
    // if that doesn't work fallback for the full image
    const [thumbnail, useLazy] = getCanvasThumbnail(canvas);

    return (
      <div key={key} className={classes.listItem} style={style}>
        <div className={classes.imageHolder}>
          <Draggable
            key={canvas.id}
            draggableId={`${manifestId}||||${canvas.id}`}
            index={index}
            className={classes.draggable}
          >
            {(provided, snapshot) => (
              <PortalAwareThumbnail
                provided={provided}
                snapshot={snapshot}
                thumbnail={thumbnail}
                useLazy={useLazy}
                canvas={canvas}
                classes={classes}
              />
            )}
          </Draggable>
        </div>
        <div className={classes.rowContent}>
          <Typography component="h5" variant="h5">
            <LocaleString>{canvas.label}</LocaleString>
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {canvas.type}
          </Typography>
        </div>
        <Divider className={classes.divider} />
      </div>
    );
  };

  render() {
    const { classes, items, theme, droppableId } = this.props;
    return (
      <Droppable droppableId={droppableId} isDropDisabled={true}>
        {providedDroppable => (
          <div
            ref={providedDroppable.innerRef}
            {...providedDroppable.droppableProps}
            className={classes.droppable}
          >
            <ContainerDimensions>
              {({ width, height }) => (
                <List
                  width={width}
                  height={height}
                  rowCount={items.length}
                  rowHeight={theme.spacing.unit * 2 + tileSize + 1}
                  rowRenderer={this.rowRenderer}
                  className={classes.list}
                />
              )}
            </ContainerDimensions>
            {providedDroppable.placeholder}
          </div>
        )}
      </Droppable>
    );
  }
}

CanvasList.defaultProps = {
  items: [],
  droppableId: 'iiifimagelist',
};

export default withStyles(styles)(withTheme()(CanvasList));
