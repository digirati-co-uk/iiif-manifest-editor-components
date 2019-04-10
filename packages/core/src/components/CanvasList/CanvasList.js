import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as classnames from 'classnames';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { IconButton, Toolbar, withStyles } from '@material-ui/core';
import { Cancel, AddCircle } from '@material-ui/icons';
import Panel from '../Panel/Panel';
import LocaleString from '../LocaleString/LocaleString';
import Tooltip from '../DefaultTooltip/DefaultTooltip';
import { getCanvasThumbnail } from '../IIIFCollectionExplorer/IIIFCollectionExplorer.utils';

const grid = 8;

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
  listItemDragging: {
    background: theme.palette.primary.main,
    color: theme.palette.secondary.main,
  },
  listItemSelected: {
    outline: `2px solid ${theme.palette.primary.main}`,
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
    maxWidth: 150,
    haxHeight: 100,
    height: '100%',
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

const CanvasList = ({
  classes,
  children,
  canvases,
  toolbar,
  selected,
  lang,
  select,
  remove,
  invokeAction,
  direction,
  listClass,
  itemClass,
  getResource,
}) => (
  <Panel
    horizontal={direction === 'horizontal'}
    style={direction === 'horizontal' ? {} : { height: '100%' }}
  >
    <Panel.Content>
      <Droppable
        droppableId="canvaslist"
        direction={direction}
        style={
          direction === 'horizontal' ? { width: '100%' } : { height: '100%' }
        }
      >
        {(providedDroppable, snapshotProppable) => (
          <div
            ref={providedDroppable.innerRef}
            className={
              listClass
                ? listClass
                : direction === 'vertical'
                ? classes.droppableVertical
                : classes.droppable
            }
            {...providedDroppable.droppableProps}
          >
            {canvases && canvases.length > 0 ? (
              <React.Fragment>
                {canvases.map((canvasId, index) => {
                  const canvas = getResource(canvasId);
                  if (!canvas) {
                    return '';
                  }
                  return (
                    <Draggable
                      key={canvasId}
                      draggableId={canvasId}
                      index={index}
                    >
                      {(provided, snapshot) => {
                        const [thumbnail, useLazy] = getCanvasThumbnail(
                          canvas,
                          getResource
                        );
                        return (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={classnames(
                              itemClass
                                ? itemClass
                                : direction === 'vertical'
                                ? classes.listItemVertical
                                : classes.listItem,
                              {
                                [classes.listItemSelected]:
                                  selected === canvas.id,
                                [classes.listItemDragging]: snapshot.isDragging,
                              }
                            )}
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
                                {thumbnail && (
                                  <img
                                    src={thumbnail}
                                    alt={canvas.id}
                                    className={classes.canvasThumbnail}
                                  />
                                )}
                                <span className={classes.canvasLabel}>
                                  <LocaleString
                                    fallback={canvas.id}
                                    lang={lang}
                                  >
                                    {canvas.label}
                                  </LocaleString>
                                </span>
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
                  );
                })}
                {direction === 'horizontal' && (
                  <div className={classes.defaultAddButtonSpacer}>
                    <Tooltip title="Add Canvas">
                      <IconButton onClick={() => invokeAction('add-canvas')}>
                        <AddCircle />
                      </IconButton>
                    </Tooltip>
                  </div>
                )}
              </React.Fragment>
            ) : (
              direction === 'horizontal' && (
                <div className={classes.noCanvasesContainer}>
                  No canvases in the manifest,
                  <Tooltip title="Add">
                    <IconButton onClick={() => invokeAction('add-canvas')}>
                      <AddCircle />
                    </IconButton>
                  </Tooltip>
                  a canvas.
                </div>
              )
            )}
            {providedDroppable.placeholder}
          </div>
        )}
      </Droppable>
    </Panel.Content>
    {direction === 'horizontal' ? (
      ''
    ) : toolbar ? (
      toolbar
    ) : (
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
      </Toolbar>
    )}
  </Panel>
);

CanvasList.propTypes = {
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
  /* Canvas panel direction */
  direction: PropTypes.string.isRequired,
  /* Custom list class  */
  listClass: PropTypes.string,
  /* Custom item class  */
  itemClass: PropTypes.string,
  /* getResource */
  getResource: PropTypes.func,
};

CanvasList.defaultProps = {
  selected: null,
  select: emptyFn,
  remove: emptyFn,
  invokeAction: emptyFn,
  direction: 'horizontal',
  listClass: null,
  itemClass: null,
  getResource: emptyFn,
};

export default withStyles(style)(CanvasList);
