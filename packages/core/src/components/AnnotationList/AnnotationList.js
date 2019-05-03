import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as classnames from 'classnames';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { IconButton, Typography, withStyles, Divider } from '@material-ui/core';
import { Cancel } from '@material-ui/icons';

import Panel from '../Panel/Panel';
import DefaultAnnotationListToolbar from '../DefaultAnnotationListToolbar/DefaultAnnotationListToolbar';
import Tooltip from '../DefaultTooltip/DefaultTooltip';
import style from './AnnotationList.styles';
import AnnotationListItem from './AnnotationListItem';

const emptyFn = () => {};

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
  getResource,
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
              annotations.map((annotationId, index) => {
                const annotation = getResource(annotationId);
                return (
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
                );
              })
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
  /* get individual resource */
};

AnnotationList.defaultProps = {
  selected: null,
  select: emptyFn,
  remove: emptyFn,
  invokeAction: emptyFn,
  selectedColor: 'primary',
  isEditingAllowed: true,
  getResource: emptyFn,
};

export default withStyles(style)(AnnotationList);
