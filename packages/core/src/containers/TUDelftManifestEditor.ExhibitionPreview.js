import React from 'react';
import PropTypes from 'prop-types';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { IconButton, Toolbar, withStyles } from '@material-ui/core';
import { Cancel, AddCircle } from '@material-ui/icons';
import Panel from '../components/Panel/Panel';
import LocaleString from '../components/LocaleString/LocaleString';
import Tooltip from '../components/DefaultTooltip/DefaultTooltip';
import { getCanvasThumbnail } from '../components/IIIFCollectionExplorer/IIIFCollectionExplorer.utils';

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

const ExhibitionPreview = ({
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
            <div className={itemClass}>
              <span>Exhibition</span>
              <span>Manifest Label</span>
            </div>
            <div className={itemClass}>
              <span>About</span>
              <p>Lorem ipsum</p>
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
                      const [thumbnail, useLazy] = getCanvasThumbnail(canvas);
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
                          className={itemClass}
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
                                <LocaleString fallback={canvas.id} lang={lang}>
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
                ))}
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
  /* Canvas panel direction */
  direction: PropTypes.string.isRequired,
  /* Custom list class  */
  listClass: PropTypes.string,
  /* Custom item class  */
  itemClass: PropTypes.string,
};

ExhibitionPreview.defaultProps = {
  selected: null,
  select: emptyFn,
  remove: emptyFn,
  invokeAction: emptyFn,
  direction: 'vertical',
  listClass: 'exhibition-tiles',
  itemClass: 'exhibition-tile',
};

export default withStyles(style)(ExhibitionPreview);
