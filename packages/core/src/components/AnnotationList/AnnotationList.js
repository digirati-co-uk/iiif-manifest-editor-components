import React from 'react';
import PropTypes from 'prop-types';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { IconButton, Typography, withStyles, Divider } from '@material-ui/core';
import { Cancel } from '@material-ui/icons';

import Panel from '../Panel/Panel';
import DefaultAnnotationListToolbar from '../DefaultAnnotationListToolbar/DefaultAnnotationListToolbar';
import LocaleString from '../LocaleString/LocaleString';
import Tooltip from '../DefaultTooltip/DefaultTooltip';
import { EditorConsumer } from '../EditorContext/EditorContext';

const getItemStyle = (isDragging, draggableStyle) => ({
  outline: isDragging ? '2px solid rgb(89, 191, 236)' : '0',
  ...draggableStyle,
});

const emptyFn = () => {};

const style = theme => ({
  list: {
    width: '100%',
    padding: theme.spacing.unit,
    minHeight: '100%',
    position: 'relative',
  },
  annotationDraggable: {
    userSelect: 'none',
    padding: `${theme.spacing.unit / 2}px 0 ${theme.spacing.unit / 2}px ${
      theme.spacing.unit
    }px`,
    margin: `0`,
    background: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'row',
    alingItems: 'center',
    justifyContent: 'stretch',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  defaultAnnotation: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'stretch',
    maxWidth: 'calc(100% - 40px)',
  },
  defaultAnnotationText: {
    flex: 1,
    padding: '0 0 0 1rem',
    overflow: 'hidden',
  },
  defaultAnnotationTypo: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  defaultNoAnnotationIndicator: {
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

const AnnotationList = ({
  classes,
  children,
  annotations,
  toolbar,
  selected,
  lang,
  select,
  remove,
  invokeAction,
}) => (
  <Panel>
    {toolbar ? (
      toolbar
    ) : (
      <DefaultAnnotationListToolbar invokeAction={invokeAction} />
    )}
    <Divider />
    <Panel.Content>
      <EditorConsumer>
        {configuration => (
          <Droppable droppableId="annotationlist">
            {(providedDroppable, snapshotDroppable) => (
              <div ref={providedDroppable.innerRef} className={classes.list}>
                {annotations ? (
                  annotations.map((annotation, index) => (
                    <Draggable
                      key={annotation.id}
                      draggableId={annotation.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                          className={classes.annotationDraggable}
                        >
                          {typeof children === 'function' ? (
                            children(annotation, remove, select)
                          ) : (
                            <div
                              key={annotation.id}
                              className={classes.defaultAnnotation}
                              onClick={ev => {
                                select(annotation);
                              }}
                            >
                              {configuration.annotation[
                                [
                                  annotation.body.type,
                                  annotation.motivation,
                                ].join('::')
                              ]
                                ? configuration.annotation[
                                    [
                                      annotation.body.type,
                                      annotation.motivation,
                                    ].join('::')
                                  ].icon({
                                    color:
                                      selected === annotation.id
                                        ? 'primary'
                                        : 'inherit',
                                  })
                                : ''}
                              <div
                                className={classes.defaultAnnotationText}
                                title={
                                  annotation.label && annotation.label[lang]
                                    ? annotation.label[lang]
                                    : annotation.id
                                }
                              >
                                <Typography
                                  color={
                                    selected === annotation.id
                                      ? 'primary'
                                      : 'inherit'
                                  }
                                  variant="subtitle2"
                                  className={classes.defaultAnnotationTypo}
                                >
                                  <LocaleString
                                    fallback={annotation.id}
                                    lang={lang}
                                  >
                                    {annotation.label}
                                  </LocaleString>
                                </Typography>
                              </div>
                            </div>
                          )}
                          <Tooltip title="Delete Annotation" placement="right">
                            <IconButton onClick={() => remove(annotation)}>
                              <Cancel />
                            </IconButton>
                          </Tooltip>
                        </div>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <Typography
                    variant="caption"
                    className={classes.defaultNoAnnotationIndicator}
                  >
                    No Annotations
                  </Typography>
                )}
                {providedDroppable.placeholder}
              </div>
            )}
          </Droppable>
        )}
      </EditorConsumer>
    </Panel.Content>
  </Panel>
);

AnnotationList.propTypes = {
  /* JSS classes */
  classes: PropTypes.any,
  /* custom item renderer function fn(annotation:obj, remove: func, select: func)*/
  children: PropTypes.func,
  /* annotations in this specific list */
  annotations: PropTypes.array,
  /* custom toolbar, if annotation type restrictions required, or for creating custom types */
  toolbar: PropTypes.any,
  /* Pa */
  selected: PropTypes.string,
  /* current language */
  lang: PropTypes.string,
  /* on annotation seleced callback */
  select: PropTypes.func,
  /* on remove callback */
  remove: PropTypes.func,
  /* toolbar action dispacher */
  invokeAction: PropTypes.func.isRequired,
};

AnnotationList.defaultProps = {
  selected: null,
  select: emptyFn,
  remove: emptyFn,
  invokeAction: emptyFn,
};

export default withStyles(style)(AnnotationList);
