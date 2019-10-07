import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Rnd } from 'react-rnd';
import { Droppable } from 'react-beautiful-dnd';
import { IconButton, withStyles } from '@material-ui/core';
import { ZoomIn, ZoomOut } from '@material-ui/icons';

import AnnotationBodyRenderer from '../AnnotationBodyRenderer/AnnotationBodyRenderer';
import { getBounds, makeURLHash } from '../../utils/IIIFResource';
import { isCanvasChangedEditor } from '../../utils/changeDetection';

const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f0f0f0',
};

const styles = theme => ({
  noCanvasSelectedMessage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  root: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  canvasBackground: {
    width: '100%',
    height: '100%',
    overflow: 'auto',
    background: 'rgba(0,0,0,0.2)',
    position: 'absolute',
  },
  zoomButtons: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

const emptyFn = () => {};
const getListStyle = (isDraggingOver, draggableStyle) => ({
  background: isDraggingOver ? 'rgb(89, 191, 236)' : 'white',
  // styles we need to apply on draggables
  ...draggableStyle,
  position: 'relative',
});

const PARSE_TRANSFORM = /(?:translate\((\d+)px,\s+(\d+)px\))/;

class EditableCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom: 1,
      canvas: props.canvas,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.selectedAnnotation !== this.props.selectedAnnotation ||
      isCanvasChangedEditor(
        nextProps.canvas,
        this.props.canvas,
        this.props.getResource,
        id => nextState.resources[id]
      )
    );
  }

  zoomIn = () => {
    this.setState({
      zoom: this.state.zoom * 1.2,
    });
  };
  zoomOut = () => {
    this.setState({
      zoom: this.state.zoom * 0.8,
    });
  };

  selectItem = item => () => this.props.select(item);

  isAspectRationLocked = type => this.props.lockAspectRatio.includes(type);

  onDrag = annotation => (ev, direction, src) => emptyFn;

  onDragStop = annotation => (ev, data) => {
    let cords = data.node.style.transform.match(PARSE_TRANSFORM);
    if (cords) {
      this.updateBounds(
        annotation,
        {
          x: parseInt(parseInt(cords[1], 10) / this.state.zoom, 10),
          y: parseInt(parseInt(cords[2], 10) / this.state.zoom, 10),
        },
        this.props.canvas
      );
    }
  };

  onResize = annotation => (ev, direction, src) => emptyFn;

  onResizeStop = annotation => (ev, direction, src) => {
    this.updateBounds(
      annotation,
      {
        w: parseInt(src.offsetWidth / this.state.zoom, 10),
        h: parseInt(src.offsetHeight / this.state.zoom, 10),
      },
      this.props.canvas
    );
  };

  updateBounds = (annotation, boundsUpdate, canvas) => {
    const oldBounds = getBounds(annotation, canvas);
    const bounds = {
      ...oldBounds,
      ...boundsUpdate,
    };
    const hash = makeURLHash({
      xywh: `${bounds.x},${bounds.y},${bounds.w},${bounds.h}`,
    });
    if (annotation.target && typeof annotation.target.id === 'string') {
      this.props.update(annotation, 'target.id', null, `${canvas.id}${hash}`);
    } else {
      this.props.update(annotation, 'target', null, `${canvas.id}${hash}`);
    }
  };

  renderAnnotation = canvas => annotation => {
    let lockAspectRatio = this.isAspectRationLocked(
      annotation.body.type
    );
    const { selectedAnnotation } = this.props;
    let bounds = getBounds(annotation, canvas);
    return (
      <Rnd
        key={'annotation__' + canvas.id + '_' + annotation.id}
        style={{
          ...style,
          outline:
            annotation.id === selectedAnnotation
              ? '2px solid rgb(89, 191, 236)'
              : '0',
        }}
        position={{
          x: parseInt(bounds.x * this.state.zoom, 10),
          y: parseInt(bounds.y * this.state.zoom, 10),
        }}
        size={{
          width: parseInt(bounds.w * this.state.zoom, 10),
          height: parseInt(bounds.h * this.state.zoom, 10),
        }}
        onDrag={this.onDrag(annotation)}
        onDragStop={this.onDragStop(annotation)}
        onResize={this.onResize(annotation)}
        onResizeStop={this.onResizeStop(annotation)}
        bounds="parent"
        lockAspectRatio={lockAspectRatio}
        onClick={this.selectItem(annotation)}
      >
        <AnnotationBodyRenderer annotation={annotation} />
      </Rnd>
    );
  }

  renderZoomControls = () => {
    const { classes } = this.props;
    return (
      <div className={classes.zoomButtons}>
        <IconButton onClick={this.zoomIn}>
          <ZoomIn />
        </IconButton>
        <IconButton onClick={this.zoomOut}>
          <ZoomOut />
        </IconButton>
      </div>
    )
  };

  getAnnotations = canvas =>
    canvas && canvas.items && canvas.items[0] && canvas.items[0].items
      ? canvas.items[0].items
      : [];

  render() {
    let { classes, canvas } = this.props;
    if (!canvas) {
      return (
        <div className={classes.noCanvasSelectedMessage}>
          Please Select A Canvas
        </div>
      );
    }
    const annotations = this.getAnnotations(canvas);

    return (
      <div className={classes.root}>
        <div className={classes.canvasBackground}>
          <Droppable droppableId="canvaseditor">
            {(provided, snapshot) => (
              <div
                className="canvas"
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver, {
                  width: canvas.width * this.state.zoom,
                  height: canvas.height * this.state.zoom,
                })}
              >
                {annotations.map(this.renderAnnotation(canvas))}
              </div>
            )}
          </Droppable>
        </div>
        {this.renderZoomControls()}
      </div>
    );
  }
}

EditableCanvas.propTypes = {
  /* Editable canvas  */
  canvas: PropTypes.object,
  selectedAnnotation: PropTypes.string,
  lockAspectRatio: PropTypes.array.isRequired,
  select: PropTypes.func,
  update: PropTypes.func,
  getResource: PropTypes.func,
};

EditableCanvas.defaultProps = {
  canvas: null,
  select: emptyFn,
  update: emptyFn,
  lockAspectRatio: ['Image', 'Video', 'Audio'],
  getResource: emptyFn,
};

export default withStyles(styles)(EditableCanvas);
