import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as PropTypes from 'prop-types';
import * as classnames from 'classnames';
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

const grid = 8;

const styles = theme => ({
  droppable: {
    position: 'relative',
    display: 'flex',
    //padding: theme.spacing.unit,
    padding: 0,
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
    margin: `${theme.spacing.unit}px ${theme.spacing.unit / 2}px`,
    display: 'flex',
    alignItems: 'stretch',
    maxWidth: 110,
    minWidth: 110,
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
      // style={{
      //   marginLeft: provided.innerRef.
      // }}
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
  shouldComponentUpdate(nextProps) {
    console.log(nextProps, this.props);
    return (
      nextProps.selected !== this.props.selected ||
      isCanvasListChanged(
        nextProps.canvases,
        this.props.canvases,
        this.props.getResource,
        this.props.lang
      )
    );
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
            const [thumbnail, useLazy] = getCanvasThumbnail(
              canvas,
              getResource
            );
            //console.log(provided, snapshot);
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
    return 'meh';
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
                    {canvases && canvases.length > 0 ? (
                      <React.Fragment>
                        <Grid
                          selected={selected}
                          cellRenderer={this.cellRenderer}
                          //className={styles.BodyGrid}
                          columnWidth={
                            direction === 'vertical' ? width : height
                          }
                          columnCount={
                            direction === 'vertical' ? 1 : canvases.length
                          }
                          height={height}
                          noContentRenderer={this.noContentRenderer}
                          overscanColumnCount={
                            direction === 'vertical' ? 1 : 20
                          }
                          overscanRowCount={direction === 'vertical' ? 20 : 1}
                          rowHeight={direction === 'vertical' ? -1 : height}
                          rowCount={
                            direction === 'vertical' ? canvases.length : 1
                          }
                          // scrollToColumn={scrollToColumn}
                          // scrollToRow={scrollToRow}
                          width={width}
                        />
                        {direction === 'horizontal' && (
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
                        {providedDroppable.placeholder}
                      </React.Fragment>
                    ) : (
                      direction === 'horizontal' && (
                        <div className={classes.noCanvasesContainer}>
                          No canvases in the manifest,
                          <Tooltip title="Add">
                            <IconButton
                              onClick={() => invokeAction('add-canvas')}
                            >
                              <AddCircle />
                            </IconButton>
                          </Tooltip>
                          a canvas.
                        </div>
                      )
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

export default withStyles(styles)(CanvasList);
