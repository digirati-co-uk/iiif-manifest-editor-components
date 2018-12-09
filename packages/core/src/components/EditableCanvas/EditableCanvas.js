import React from 'react';
import PropTypes from 'prop-types';
import { Rnd } from 'react-rnd';
import { Droppable } from 'react-beautiful-dnd';
import { IconButton } from '@material-ui/core';
import { ZoomIn, ZoomOut } from '@material-ui/icons';

import AnnotationBodyRenderer from '../AnnotationBodyRenderer/AnnotationBodyRenderer';
import { getHashParams, makeURLHash } from '../../utils/IIIFResource';

const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f0f0f0',
};

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

  onDrag = annotation => (ev, data) => {
    // TODO: this should operate on a temporary annotation
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

  onDragStop = annotation => (ev, data) => {
    // TODO: this should update the annotation
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

  onResize = annotation => (ev, direction, src) => {
    // TODO: this should update the annotation
    this.updateBounds(
      annotation,
      {
        w: parseInt(src.offsetWidth / this.state.zoom, 10),
        h: parseInt(src.offsetHeight / this.state.zoom, 10),
      },
      this.props.canvas
    );
  };

  onResizeStop = annotation => (ev, direction, src) => {
    // TODO: this should update the annotation
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
    const oldBounds = this.getBounds(annotation, canvas);
    const bounds = {
      ...oldBounds,
      ...boundsUpdate,
    };
    const hash = makeURLHash({
      xywh: `${bounds.x},${bounds.y},${bounds.w},${bounds.h}`,
    });
    this.props.update(annotation, {
      target: `${canvas.id}${hash}`,
    });
  };

  getBounds = (annotation, canvas) => {
    if (annotation.type === 'Annotation' && annotation.target) {
      let xywh = getHashParams(annotation.target).xywh;
      if (xywh) {
        let [x, y, w, h] = xywh.split(',');
        return {
          x: parseInt(x, 10),
          y: parseInt(y, 10),
          w: parseInt(w, 10),
          h: parseInt(h, 10),
        };
      } else {
        return {
          x: 0,
          y: 0,
          w: canvas.width,
          h: canvas.height,
        };
      }
    }
    //TODO: ???
  };

  render() {
    let { canvas } = this.props;
    if (!canvas) {
      return (
        <div
          className="canvas-editor"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          Please Select A Canvas
        </div>
      );
    }
    let self = this;
    const annotations =
      canvas && canvas.items && canvas.items[0] && canvas.items[0].items
        ? canvas.items[0].items
        : [];
    const { selectedAnnotation } = this.props;
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            overflow: 'auto',
            background: 'rgba(0,0,0,0.2)',
            position: 'absolute',
          }}
        >
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
                {annotations.map((annotation, idx) => {
                  let lockAspectRatio = this.isAspectRationLocked(
                    annotation.body.type
                  );
                  let bounds = this.getBounds(annotation, canvas);
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
                })}
              </div>
            )}
          </Droppable>
        </div>
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
          }}
        >
          <IconButton onClick={this.zoomIn}>
            <ZoomIn />
          </IconButton>
          <IconButton onClick={this.zoomOut}>
            <ZoomOut />
          </IconButton>
        </div>
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
};

EditableCanvas.defaultProps = {
  canvas: null,
  select: emptyFn,
  update: emptyFn,
  lockAspectRatio: ['Image', 'Video', 'Audio'],
};

export default EditableCanvas;
