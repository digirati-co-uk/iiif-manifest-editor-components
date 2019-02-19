import React from 'react';
import PropTypes from 'prop-types';
//import { Rnd } from 'react-rnd';
import { Droppable } from 'react-beautiful-dnd';
import { IconButton, withStyles } from '@material-ui/core';
import { ZoomIn, ZoomOut } from '@material-ui/icons';
import ContainerDimensions from 'react-container-dimensions';

import AnnotationBodyRenderer from '../AnnotationBodyRenderer/AnnotationBodyRenderer';
import { getBounds, makeURLHash } from '../../utils/IIIFResource';
//Experimental workaround for again Canvas Panel....
import ReactScrollWheelHandler from 'react-scroll-wheel-handler';

import {
  Viewport,
  OpenSeadragonViewport,
  OpenSeadragonViewer,
  CanvasRepresentation,
} from '@canvas-panel/core';
import EditableAnnotation from './EditableAnnotation';

const styles = theme => ({
  '@global': {
    '.navigator': {
      zIndex: 1000,
    },
  },
  noCanvasSelectedMessage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  root: {
    overflow: 'hidden',
    position: 'relative',
    webkitUserSelect: 'none',
    mozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
  },
  container: {
    width: '100%',
    position: 'absolute',
    height: '100%',
    flex: 1,
    top: 0,
    left: 0,
  },
  canvasBackground: {
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.2)',
    position: 'relative',
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

const whiteBG = {
  width: 1000,
  height: 1000,
  tileSize: 256,
  getTileUrl: (level, x, y) => {
    return (
      'data:image/svg+xml;base64,' +
      btoa(
        `<?xml version="1.0" encoding="utf-8"?>\
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \
    x="0px" y="0px" viewBox="0 0 256 256" style="enable-background:new 0 0 256 256;" xml:space="preserve">\
    <g>\
      <rect x="0" y="0" style="fill:#FFFFFF;" width="256" height="256"/>\
      </g>\
    </svg>`
      )
    );
  },
};

class EditableCanvasPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canvas: props.canvas,
    };
  }

  zoomIn = ev => {
    if (ev) {
      ev.preventDefault();
    }
    if (this.viewport) {
      this.viewport.zoomIn();
    }
  };
  zoomOut = ev => {
    if (ev) {
      ev.preventDefault();
    }

    if (this.viewport) {
      this.viewport.zoomOut();
    }
  };

  selectItem = item => () => this.props.select(item);

  isAspectRationLocked = type => this.props.lockAspectRatio.includes(type);

  updateBounds = (annotation, boundsUpdate, canvas) => {
    const oldBounds = getBounds(annotation, canvas);
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

  setViewport = v => (this.viewport = v);

  render() {
    let { classes, canvas, style } = this.props;
    if (!canvas) {
      return (
        <div className={classes.noCanvasSelectedMessage}>
          Please Select A Canvas
        </div>
      );
    }
    const annotations =
      canvas && canvas.items && canvas.items[0] && canvas.items[0].items
        ? canvas.items[0].items
        : [];
    const { selectedAnnotation } = this.props;
    const ratio = 1;
    if (
      !this.canvas ||
      this.canvas.id !== canvas.id ||
      this.canvas.width !== canvas.width ||
      this.canvas.height !== canvas.height
    ) {
      this.canvas = {
        id: canvas.id,
        getWidth: () => canvas.width,
        getHeight: () => canvas.height,
        __jsonld: canvas,
      };
      whiteBG.width = canvas.width || 1000;
      whiteBG.height = canvas.height || 1000;
      this.tileSources = [whiteBG];
    }
    return (
      <div
        className={classes.root}
        style={
          style || {
            flex: 1,
          }
        }
      >
        <div className={classes.container}>
          <Droppable droppableId="canvaseditor">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                className={classes.canvasBackground}
                style={{
                  background: snapshot.isDraggingOver ? 'skyblue' : '',
                }}
              >
                <ContainerDimensions>
                  {({ width, height }) => (
                    <Viewport
                      setRef={this.setViewport}
                      imageUri={whiteBG['@id']}
                      tileSources={this.tileSources}
                      width={width}
                      height={height}
                      canvas={this.canvas}
                    >
                      <OpenSeadragonViewport viewportController={true}>
                        <OpenSeadragonViewer maxHeight={height} />
                      </OpenSeadragonViewport>
                      <CanvasRepresentation ratio={ratio}>
                        {annotations.map(annotation => {
                          const bounds = getBounds(annotation, canvas);
                          // TODO: lock aspect ratio
                          let lockAspectRatio = this.isAspectRationLocked(
                            annotation.body.type
                          );
                          return (
                            <EditableAnnotation
                              key={annotation.id}
                              x={bounds.x}
                              y={bounds.y}
                              width={bounds.w}
                              height={bounds.h}
                              target={canvas.id}
                              ratio={ratio}
                              setCoords={xywh => {
                                const meh = {};
                                if (xywh.hasOwnProperty('x')) {
                                  meh.x = xywh.x;
                                }
                                if (xywh.hasOwnProperty('y')) {
                                  meh.y = xywh.y;
                                }
                                if (xywh.hasOwnProperty('width')) {
                                  meh.w = xywh.width;
                                }
                                if (xywh.hasOwnProperty('height')) {
                                  meh.h = xywh.height;
                                }
                                this.updateBounds(annotation, meh, canvas);
                              }}
                              boxStyles={
                                annotation.id === selectedAnnotation
                                  ? {
                                      outline: '1px solid skyblue',
                                      background: 'rgba(135, 206, 235, 0.3)',
                                    }
                                  : {
                                      outline: '1px solid transparent',
                                      background: 'rgba(135, 135, 135, 0.1)',
                                    }
                              }
                              onClick={this.selectItem(annotation)}
                            >
                              {/* <ReactScrollWheelHandler
                                upHandler={this.zoomIn}
                                downHandler={this.zoomOut}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  outline: 0,
                                }}
                              > */}
                              <AnnotationBodyRenderer annotation={annotation} />
                              {/* </ReactScrollWheelHandler> */}
                            </EditableAnnotation>
                          );
                        })}
                      </CanvasRepresentation>
                    </Viewport>
                  )}
                </ContainerDimensions>
              </div>
            )}
          </Droppable>
          <div className={classes.zoomButtons}>
            <IconButton onClick={this.zoomIn}>
              <ZoomIn />
            </IconButton>
            <IconButton onClick={this.zoomOut}>
              <ZoomOut />
            </IconButton>
          </div>
        </div>
      </div>
    );
  }
}

EditableCanvasPanel.propTypes = {
  /* Editable canvas  */
  canvas: PropTypes.object,
  selectedAnnotation: PropTypes.string,
  lockAspectRatio: PropTypes.array.isRequired,
  select: PropTypes.func,
  update: PropTypes.func,
};

EditableCanvasPanel.defaultProps = {
  canvas: null,
  select: emptyFn,
  update: emptyFn,
  lockAspectRatio: ['Image', 'Video', 'Audio'],
};

export default withStyles(styles)(EditableCanvasPanel);
