import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as PropTypes from 'prop-types';
import classnames from 'classnames';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { IconButton, Toolbar, withStyles } from '@material-ui/core';
import { Cancel, AddCircle } from '@material-ui/icons';
import Panel from '../Panel/Panel';
import LocaleString from '../LocaleString/LocaleString';
import Tooltip from '../DefaultTooltip/DefaultTooltip';
import { getCanvasThumbnail } from '../IIIFCollectionExplorer/IIIFCollectionExplorer.utils';
import { isCanvasListChanged } from '../../utils/changeDetection';
import { Grid } from 'react-virtualized';
import ContainerDimensions from 'react-container-dimensions';
import styles from './CanvasList.styles';

const grid = 8;


const emptyFn = () => {};

const CanvasListItem = ({
  provided,
  snapshot,
  itemClass,
  direction,
  classes,
  canvas,
  children,
  thumbnail,
  select,
  remove,
  selected,
  lang,
}) => {
  const usePortal = snapshot.isDragging;
  const child = (
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
          [classes.listItemSelected]: selected === canvas.id,
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
            canvas.label && canvas.label[lang] ? canvas.label[lang] : canvas.id
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
  if (!usePortal) {
    return child;
  }
  const portal = document.querySelector('.drag-drop-portal');
  // if dragging - put the item in a portal
  return ReactDOM.createPortal(child, portal);
};

class CanvasList extends React.Component {
  constructor(props) {
    super(props);
    this.lastCanvasListChange = new Date().getTime();
  }
  shouldComponentUpdate(nextProps) {
    const canvasListChanged = isCanvasListChanged(
      nextProps.canvases,
      this.props.canvases,
      this.props.getResource,
      this.props.lang
    );
    if (
      this.props.canvas &&
      nextProps.canvas &&
      this.props.canvas.label &&
      nextProps.canvas.label &&
      this.props.canvas.label[this.props.lang] !==
        nextProps.canvas.label[this.props.lang]
    ) {
      this.lastCanvasListChange = new Date().getTime();
      return true;
    }

    if (canvasListChanged) {
      this.lastCanvasListChange = new Date().getTime();
    }
    return nextProps.selected !== this.props.selected || canvasListChanged;
  }

  cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
    const {
      getResource,
      children,
      classes,
      itemClass,
      lang,
      select,
      remove,
      direction,
      selected,
    } = this.props;
    const index = columnIndex > rowIndex ? columnIndex : rowIndex;
    const canvasId = this.props.canvases[index];
    const canvas = getResource(canvasId);
    if (!canvas) {
      return '';
    }
    return (
      <div key={key} style={style}>
        <Draggable key={canvasId} draggableId={canvasId} index={index}>
          {(provided, snapshot) => {
            const thumbnail = getCanvasThumbnail(
              canvas,
              getResource
            );
            return (
              <CanvasListItem
                {...{
                  provided,
                  snapshot,
                  itemClass,
                  direction,
                  classes,
                  canvas,
                  children,
                  thumbnail,
                  select,
                  remove,
                  selected,
                  lang,
                }}
              />
            );
          }}
        </Draggable>
      </div>
    );
  };
  noContentRenderer = () => {
    const { direction, classes, invokeAction } = this.props;
    return (
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
    );
  };

  render() {
    const {
      classes,
      children,
      canvases,
      toolbar,
      selected,
      invokeAction,
      direction,
      listClass,
      itemClass,
      getResource,
    } = this.props;
    return (
      <Panel
        horizontal={direction === 'horizontal'}
        style={direction === 'horizontal' ? {} : { height: '100%' }}
      >
        <Panel.Content>
          <ContainerDimensions>
            {({ width, height }) => (
              <Droppable
                droppableId="canvaslist"
                direction={direction}
                style={{ width: width, height: height }}
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
                    <Grid
                      selected={selected}
                      lastCanvasListChange={this.lastCanvasListChange}
                      cellRenderer={this.cellRenderer}
                      //className={styles.BodyGrid}
                      columnWidth={direction === 'vertical' ? width : height}
                      columnCount={
                        direction === 'vertical' ? 1 : canvases.length
                      }
                      height={height}
                      noContentRenderer={this.noContentRenderer}
                      overscanColumnCount={direction === 'vertical' ? 1 : 20}
                      overscanRowCount={direction === 'vertical' ? 20 : 1}
                      rowHeight={direction === 'vertical' ? -1 : height}
                      rowCount={direction === 'vertical' ? canvases.length : 1}
                      // scrollToColumn={scrollToColumn}
                      // scrollToRow={scrollToRow}
                      width={width}
                    />
                    {providedDroppable.placeholder}
                    {direction === 'horizontal' &&
                      canvases &&
                      canvases.length > 0 && (
                        <div className={classes.defaultAddButtonSpacer}>
                          <Tooltip title="Add Canvas">
                            <IconButton
                              onClick={() => invokeAction('add-canvas')}
                            >
                              <AddCircle />
                            </IconButton>
                          </Tooltip>
                        </div>
                      )}
                  </div>
                )}
              </Droppable>
            )}
          </ContainerDimensions>
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
  }
}

CanvasList.propTypes = {
  /* JSS classes */
  classes: PropTypes.any,
  /* if a function passed, the rendered of the children can be overridden */
  children: PropTypes.any,
  /* selected canvas for the change detection */
  canvas: PropTypes.any,
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
  canvas: null,
  selected: null,
  select: emptyFn,
  remove: emptyFn,
  invokeAction: emptyFn,
  direction: 'horizontal',
  listClass: null,
  itemClass: null,
  getResource: emptyFn,
};

export default withStyles(styles)(CanvasList);
