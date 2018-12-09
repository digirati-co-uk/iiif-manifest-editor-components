import React from 'react';
import PropTypes from 'prop-types';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { IconButton, withStyles } from '@material-ui/core';
import { Cancel, AddCircle } from '@material-ui/icons';
import Panel from '../Panel/Panel';
import LocaleString from '../LocaleString/LocaleString';
import Tooltip from '../DefaultTooltip/DefaultTooltip';

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
  listItem: {
    userSelect: 'none',
    padding: `${theme.spacing.unit / 2}px ${theme.spacing.unit * 2}px`,
    margin: `0 ${theme.spacing.unit}px 0 0`,
    display: 'flex',
    alignItems: 'flex-end',
    maxWidth: 180,
    position: 'relative',
    height: 100,
    boxSizing: 'border-box',
  },
  canvas: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
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
}) => (
  <Panel horizontal={true}>
    {toolbar && <Panel.Toolbar>{toolbar}</Panel.Toolbar>}
    <Panel.Content>
      <Droppable droppableId="canvaslist" direction="horizontal">
        {(providedDroppable, snapshotProppable) => (
          <div
            ref={providedDroppable.innerRef}
            style={getListStyle(snapshotProppable.isDraggingOver)}
            className={classes.droppable}
            {...providedDroppable.droppableProps}
          >
            {canvases && canvases.length > 0 ? (
              <React.Fragment>
                {canvases.map((canvas, index) => (
                  <Draggable
                    key={canvas.id}
                    draggableId={canvas.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style,
                          selected === canvas.id
                        )}
                        className={classes.listItem}
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
                            <LocaleString fallback={canvas.id} lang={lang}>
                              {canvas.label}
                            </LocaleString>
                          </div>
                        )}
                        <Tooltip title="Delete Canvas">
                          <IconButton
                            onClick={() => remove(canvas)}
                            className={classes.deleteButton}
                          >
                            <Cancel />
                          </IconButton>
                        </Tooltip>
                      </div>
                    )}
                  </Draggable>
                ))}
                <div className={classes.defaultAddButtonSpacer}>
                  <Tooltip title="Add Canvas">
                    <IconButton onClick={() => invokeAction('add-canvas')}>
                      <AddCircle />
                    </IconButton>
                  </Tooltip>
                </div>
              </React.Fragment>
            ) : (
              <div className={classes.noCanvasesContainer}>
                No canvases in the manifest,
                <Tooltip title="Add">
                  <IconButton onClick={() => invokeAction('add-canvas')}>
                    <AddCircle />
                  </IconButton>
                </Tooltip>
                a canvas.
              </div>
            )}
            {providedDroppable.placeholder}
          </div>
        )}
      </Droppable>
    </Panel.Content>
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
};

CanvasList.defaultProps = {
  selected: null,
  select: emptyFn,
  remove: emptyFn,
  invokeAction: emptyFn,
};

export default withStyles(style)(CanvasList);
