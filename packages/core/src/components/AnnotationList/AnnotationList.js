import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as classnames from 'classnames';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { IconButton, Typography, withStyles, Divider } from '@material-ui/core';
import { Cancel } from '@material-ui/icons';

import Panel from '../Panel/Panel';
import DefaultAnnotationListToolbar from '../DefaultAnnotationListToolbar/DefaultAnnotationListToolbar';
import Tooltip from '../DefaultTooltip/DefaultTooltip';
import AnnotationListItem from './AnnotationListItem';

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
    alignItems: 'center',
    justifyContent: 'stretch',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  annotationDragging: {
    outline: `2px solid ${theme.palette.primary.main}`,
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
  selectedColor,
  isEditingAllowed,
}) => (
  <Panel>
    {toolbar ? (
      toolbar
    ) : (
      <DefaultAnnotationListToolbar
        invokeAction={invokeAction}
        disableActions={!isEditingAllowed}
      />
    )}
    <Divider />
    <Panel.Content>
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
                      className={classnames(classes.annotationDraggable, {
                        [classes.annotationDragging]: snapshot.isDragging,
                      })}
                    >
                      {typeof children === 'function' ? (
                        children(annotation, remove, select)
                      ) : (
                        <AnnotationListItem
                          annotation={annotation}
                          lang={lang}
                          onSelect={select}
                          isSelected={selected === annotation.id}
                          selectedColor={selectedColor}
                        />
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
  /* Sets the toolbar buttons disabled and TODO: disable delete and drag and drop */
  isEditingAllowed: PropTypes.bool,
};

AnnotationList.defaultProps = {
  selected: null,
  select: emptyFn,
  remove: emptyFn,
  invokeAction: emptyFn,
  selectedColor: 'primary',
  isEditingAllowed: true,
};

export default withStyles(style)(AnnotationList);
