import React from 'react';
import PropTypes from 'prop-types';
import * as classnames from 'classnames';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { IconButton, Toolbar, withStyles } from '@material-ui/core';
import { Cancel, AddCircle, ZoomIn } from '@material-ui/icons';

import { Panel, LocaleString, Tooltip } from '@IIIF-MEC/core';
// import Panel from '../components/Panel/Panel';
// import LocaleString from '../components/LocaleString/LocaleString';
// import Tooltip from '../components/DefaultTooltip/DefaultTooltip';

const XYWHRx = /(?:.*xywh\=(\d+),(\d+),(\d+),(\d+).*)/;

export const getCanvasThumbnails = canvas => {
  let thumbnails = null;
  const annotations =
    canvas.items &&
    canvas.items.length &&
    canvas.items[0].items &&
    canvas.items[0].items.length &&
    canvas.items[0].items; // hopefully for now

  if (annotations) {
    thumbnails = annotations.reduce((results, annotation, index) => {
      let xywh = null;
      if (annotation.target) {
        const targetXYWH = annotation.target.match(XYWHRx);
        if (targetXYWH && targetXYWH.length === 5) {
          xywh = {
            x: parseInt(targetXYWH[1], 10),
            y: parseInt(targetXYWH[2], 10),
            w: parseInt(targetXYWH[3], 10),
            h: parseInt(targetXYWH[4], 10),
          };
        }
      }
      if (annotation.thumbnail) {
        if (typeof annotation.thumbnail === 'string') {
          results[index] = {
            url: annotation.thumbnail,
            xywh,
          };
        } else if (
          Array.isArray(annotation.thumbnail) &&
          annotation.thumbnail.length
        ) {
          results[index] = {
            url:
              typeof annotation.thumbnail[0] === 'string'
                ? annotation.thumbnail[0]
                : annotation.thumbnail[0].id,
            xywh,
          };
        } else if (annotation.thumbnail.id) {
          thumbnail = annotation.thumbnail.id;
          results[index] = {
            url: annotation.thumbnail.id,
            xywh,
          };
        }
      }
      if (
        !results[index] &&
        annotation &&
        annotation.body &&
        annotation.body.id
      ) {
        const iiifImageParts = annotation.body.id.split('/');
        iiifImageParts[iiifImageParts.length - 3] = '!100,100';
        results[index] = {
          url: iiifImageParts.join('/'),
          xywh,
        };
      }
      return results;
    }, []);
  }

  if ((thumbnails === null || thumbnails.length === 0) && canvas.thumbnail) {
    if (typeof canvas.thumbnail === 'string') {
      thumbnails = {
        url: canvas.thumbnail,
        xywh: null,
      };
    } else if (Array.isArray(canvas.thumbnail) && canvas.thumbnail.length) {
      thumbnails = {
        url:
          typeof canvas.thumbnail[0] === 'string'
            ? canvas.thumbnail[0]
            : canvas.thumbnail[0].id,
        xywh: null,
      };
    } else if (canvas.thumbnail.id) {
      thumbnails = {
        url: canvas.thumbnail.id,
        xywh: null,
      };
    }
  }

  return thumbnails;
};

const CanvasPreview = ({
  canvasPercentageRatio,
  thumbnails,
  canvasWidth,
  canvasHeight,
  canvas,
}) => (
  <div
    style={{
      position: 'relative',
      height: 0,
      overflow: 'visible',
      padding: `0 0 ${canvasPercentageRatio}% 0`,
    }}
  >
    {thumbnails &&
      thumbnails.length > 0 &&
      thumbnails.map(thumbnail => (
        <img
          key={`${canvas.id}__${thumbnail.url}`}
          src={thumbnail.url}
          alt={canvas.id}
          //className={classes.canvasThumbnail}
          style={{
            position: 'absolute',
            top: thumbnail.xywh
              ? (thumbnail.xywh.y / canvasHeight) * 100 + '%'
              : 0,
            left: thumbnail.xywh
              ? (thumbnail.xywh.x / canvasWidth) * 100 + '%'
              : 0,
            width: thumbnail.xywh
              ? (thumbnail.xywh.w / canvasWidth) * 100 + '%'
              : '100%',
            height: thumbnail.xywh
              ? (thumbnail.xywh.h / canvasHeight) * 100 + '%'
              : '100%',
          }}
        />
      ))}
  </div>
);

const getBaseBehaviours = behaviors => {
  const behaviours = behaviors
    ? Array.isArray(behaviors)
      ? behaviors
      : Object.keys(behaviors)
    : [];
  const w = parseInt(
    behaviours
      .filter(behaviour => behaviour.startsWith('w-'))
      .concat(['w-4'])[0]
      .replace('w-', ''),
    10
  );
  const h = parseInt(
    behaviours
      .filter(behaviour => behaviour.startsWith('h-'))
      .concat(['h-4'])[0]
      .replace('h-', ''),
    10
  );
  const isColumn =
    behaviours
      .filter(behaviour => behaviour === 'row' || behaviour === 'column')
      .concat(['row'])[0] === 'column';

  // order seem to be invariant for now...
  // const isLeft =
  //   behaviours.filter(behaviour => behaviour === 'caption-left').length > 0;
  const rest = behaviours.filter(
    behaviour =>
      !behaviour.startsWith('w-') &&
      !behaviour.startsWith('h-') &&
      behaviour !== 'row' &&
      behaviour !== 'column'
  );
  return [w, h, isColumn, rest];
};

const classnamesObj = (acc, next) => {
  acc[next] = true;
  return acc;
};

const imageClasses = behaviours => {
  const [w, h, isColumn, rest] = getBaseBehaviours(behaviours);
  return [
    'w-' + (isColumn ? w : Math.floor((w / 3) * 2)),
    'h-' + (isColumn ? Math.floor((h / 3) * 2) : h),
  ]
    .concat(rest)
    .reduce(classnamesObj, {});
};

const summaryClasses = behaviours => {
  const [w, h, isColumn, rest] = getBaseBehaviours(behaviours);
  return [
    'w-' + (isColumn ? w : w - Math.floor((w / 3) * 2)),
    'h-' + (isColumn ? h - Math.floor((h / 3) * 2) : h),
  ]
    .concat(rest)
    .reduce(classnamesObj, {});
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle, isSelected) => ({
  // change background colour if dragging
  background: isDragging ? 'rgb(89, 191, 236)' : 'rgb(236, 231, 231)',
  color: isDragging ? 'rgb(255,255,255)' : 'rgb(0, 0, 0)',
  outline: isSelected ? '2px solid rgb(89, 191, 236)' : '0',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver, draggableStyle) => ({
  background: isDraggingOver ? 'white' : 'white',
  //...draggableStyle,
});

const style = theme => ({
  droppable: {
    position: 'relative',
    display: 'flex',
    padding: theme.spacing.unit,
    overflow: 'auto',
    minHeight: '100%',
  },
  droppableVertical: {
    position: 'relative',
    padding: theme.spacing.unit,
    overflow: 'auto',
    maxWidth: '100%',
  },
  listItem: {
    userSelect: 'none',
    margin: `0 ${theme.spacing.unit}px 0 0`,
    display: 'flex',
    alignItems: 'stretch',
    maxWidth: 180,
    minWidth: 100,
    position: 'relative',
    height: 100,
    boxSizing: 'border-box',
  },
  listItemVertical: {
    userSelect: 'none',
    margin: `0 ${theme.spacing.unit}px 0 0`,
    display: 'inline-block',
    alignItems: 'stretch',
    width: `calc(50% - ${theme.spacing.unit}px)`,
    minWidth: 100,
    position: 'relative',
    height: 100,
    boxSizing: 'border-box',
  },
  canvas: {
    position: 'relative',
    height: '100%',
    width: '100%',
    textAlign: 'center',
  },
  canvasThumbnail: {
    //maxWidth: 150,
    //haxHeight: 100,
    //height: '100%',
    //width: '100%',
  },
  canvasLabel: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 1,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: `${theme.spacing.unit / 2}px ${theme.spacing.unit * 2}px`,
  },
  deleteButton: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  defaultAddButtonSpacer: {
    display: 'flex',
    alignItems: 'center',
  },
  noCanvasesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const emptyFn = () => {};

const ExhibitionPreview = ({
  classes,
  children,
  manifest,
  canvases,
  toolbar,
  selected,
  lang,
  select,
  remove,
  invokeAction,
  listClass,
  itemClass,
  toggleZoom,
}) => (
  <Panel horizontal={false}>
    <Panel.Content>
      <Droppable droppableId="canvaslist" direction="vertical">
        {(providedDroppable, snapshotProppable) => (
          <div
            ref={providedDroppable.innerRef}
            style={getListStyle(snapshotProppable.isDraggingOver)}
            className={listClass}
            {...providedDroppable.droppableProps}
          >
            <div className="block title cutcorners w-4 h-4">
              <div className="boxtitle">Exhibition</div>
              <div className="maintitle">
                <LocaleString fallback={manifest.id} lang={lang}>
                  {manifest.label}
                </LocaleString>
              </div>
              <div />
            </div>
            <div className="block info cutcorners w-4 h-4">
              <div className="boxtitle">About</div>
              <div className="text">
                <LocaleString fallback={manifest.id} lang={lang}>
                  {manifest.summary}
                </LocaleString>
              </div>
            </div>
            {canvases && canvases.length > 0 ? (
              <React.Fragment>
                {canvases.map((canvas, index) => (
                  <Draggable
                    key={canvas.id}
                    draggableId={canvas.id}
                    index={index}
                  >
                    {(provided, snapshot) => {
                      const thumbnails = getCanvasThumbnails(canvas);
                      console.log('canvas.behavior', canvas.behavior);
                      const behaviouralClasses = (canvas.behavior || []).reduce(
                        (acc, next) => {
                          acc[next] = true;
                          return acc;
                        },
                        {}
                      );
                      if (
                        !behaviouralClasses.column &&
                        !behaviouralClasses.row
                      ) {
                        behaviouralClasses.row = true;
                      }
                      const canvasHeight = parseInt(canvas.height || 0, 10);
                      const canvasWidth = parseInt(canvas.width || 0, 10);
                      const canvasPercentageRatio =
                        (canvasHeight / canvasWidth) * 100;
                      return (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style,
                            selected === canvas.id
                          )}
                          className={classnames(itemClass, behaviouralClasses)}
                        >
                          {typeof children === 'function' ? (
                            children(canvas, remove, select)
                          ) : (
                            <div
                              key={`canvas_list_${canvas.id}`}
                              className={classes.canvas}
                              title={
                                canvas.label && canvas.label[lang]
                                  ? canvas.label[lang]
                                  : canvas.id
                              }
                              onClick={() => select(canvas)}
                            >
                              {canvas.summary && canvas.summary[lang] ? (
                                <React.Fragment>
                                  <div
                                    className={classnames(
                                      itemClass,
                                      'image',
                                      imageClasses(behaviouralClasses)
                                    )}
                                  >
                                    <CanvasPreview
                                      canvasPercentageRatio={
                                        canvasPercentageRatio
                                      }
                                      thumbnails={thumbnails}
                                      canvasWidth={canvasWidth}
                                      canvasHeight={canvasHeight}
                                      canvas={canvas}
                                    />
                                  </div>
                                  <div
                                    className={classnames(
                                      itemClass,
                                      'info',
                                      summaryClasses(behaviouralClasses)
                                    )}
                                  >
                                    <LocaleString
                                      fallback={canvas.id}
                                      lang={lang}
                                    >
                                      {canvas.summary}
                                    </LocaleString>
                                  </div>
                                </React.Fragment>
                              ) : (
                                <React.Fragment>
                                  <CanvasPreview
                                    canvasPercentageRatio={
                                      canvasPercentageRatio
                                    }
                                    thumbnails={thumbnails}
                                    canvasWidth={canvasWidth}
                                    canvasHeight={canvasHeight}
                                    canvas={canvas}
                                  />
                                  <span className={classes.canvasLabel}>
                                    <LocaleString
                                      fallback={canvas.id}
                                      lang={lang}
                                    >
                                      {canvas.label}
                                    </LocaleString>
                                  </span>
                                </React.Fragment>
                              )}
                            </div>
                          )}
                          <Tooltip title="Delete Canvas">
                            <IconButton
                              onClick={() => remove(canvas)}
                              className={classes.deleteButton}
                            >
                              <Cancel color={'primary'} />
                            </IconButton>
                          </Tooltip>
                        </div>
                      );
                    }}
                  </Draggable>
                ))}
              </React.Fragment>
            ) : (
              ''
            )}
            {providedDroppable.placeholder}
          </div>
        )}
      </Droppable>
    </Panel.Content>
    <Toolbar
      color="secondary"
      style={{
        justifyContent: 'center',
      }}
    >
      <Tooltip title="Add Canvas">
        <IconButton onClick={() => invokeAction('add-canvas')}>
          <AddCircle />
        </IconButton>
      </Tooltip>
      <Tooltip title="Toggle Full View">
        <IconButton onClick={toggleZoom}>
          <ZoomIn />
        </IconButton>
      </Tooltip>
    </Toolbar>
  </Panel>
);

ExhibitionPreview.propTypes = {
  /* JSS classes */
  classes: PropTypes.any,
  /* if a function passed, the rendered of the children can be overridden */
  children: PropTypes.any,
  /* list of canvases to display */
  canvases: PropTypes.array,
  /* custom toolbar */
  toolbar: PropTypes.any,
  /* list of the selected canvases */
  selected: PropTypes.string,
  /* current language  */
  lang: PropTypes.string,
  /* on annotation seleced callback */
  select: PropTypes.func,
  /* on remove callback */
  remove: PropTypes.func,
  /* toolbar action dispacher */
  invokeAction: PropTypes.func.isRequired,
  /* Custom list class  */
  listClass: PropTypes.string,
  /* Custom item class  */
  itemClass: PropTypes.string,
  /* toggle full view */
  toggleZoom: PropTypes.func,
};

ExhibitionPreview.defaultProps = {
  selected: null,
  select: emptyFn,
  remove: emptyFn,
  invokeAction: emptyFn,
  listClass: 'blocks',
  itemClass: 'block',
  toggleZoom: emptyFn,
};

export default withStyles(style)(ExhibitionPreview);
