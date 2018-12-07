import React from 'react';
import PropTypes from 'prop-types';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { IconButton } from '@material-ui/core';
import { Cancel, AddCircle } from '@material-ui/icons';
import Panel from '../Panel/Panel';
import LocaleString from '../LocaleString/LocaleString';

const grid = 8;

const getItemStyle = (isDragging, draggableStyle, isSelected) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: `${grid / 2}px ${grid * 2}px`,
  margin: `0 ${grid}px 0 0`,
  display: 'flex',
  alignItems: 'flex-end',
  maxWidth: 220,
  position: 'relative',

  // change background colour if dragging
  background: isDragging ? 'rgb(89, 191, 236)' : 'rgb(236, 231, 231)',
  color: isDragging ? 'rgb(255,255,255)' : 'rgb(0, 0, 0)',
  height: 100,
  boxSizing: 'border-box',
  outline: isSelected ? '2px solid rgb(89, 191, 236)' : '0',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'white' : 'white',
  position: 'relative',
  display: 'flex',
  padding: grid,
  overflow: 'auto',
  minHeight: '100%',
});

const emptyFn = () => {};

const CanvasList = ({
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
                      >
                        {typeof children === 'function' ? (
                          children(canvas, remove, select)
                        ) : (
                          <div
                            key={`canvas_list_${canvas.id}`}
                            style={{
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                            }}
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
                        <IconButton
                          onClick={() => remove(canvas)}
                          style={{
                            //width: 40,
                            position: 'absolute',
                            top: -10,
                            right: -10,
                          }}
                        >
                          <Cancel />
                        </IconButton>
                      </div>
                    )}
                  </Draggable>
                ))}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <IconButton onClick={() => invokeAction('add-canvas')}>
                    <AddCircle />
                  </IconButton>
                </div>
              </React.Fragment>
            ) : (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                No Canvases
              </div>
            )}
          </div>
        )}
      </Droppable>
    </Panel.Content>
  </Panel>
);

CanvasList.propTypes = {
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

export default CanvasList;
