import React from 'react';
import PropTypes from 'prop-types';
import { Rnd } from 'react-rnd';
import { Droppable } from 'react-beautiful-dnd';
import { IconButton, withStyles } from '@material-ui/core';
import { ZoomIn, ZoomOut } from '@material-ui/icons';
import ContainerDimensions from 'react-container-dimensions';

import AnnotationBodyRenderer from '../AnnotationBodyRenderer/AnnotationBodyRenderer';
import { getBounds, makeURLHash } from '../../utils/IIIFResource';

import {
  Viewport,
  OpenSeadragonViewport,
  OpenSeadragonViewer,
  CanvasRepresentation,
} from '@canvas-panel/core';
import EditableAnnotation from './EditableAnnotation';

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
    webkitUserSelect: 'none',
    mozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
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
  '@context': 'http://iiif.io/api/image/2/context.json',
  '@id':
    'https://dlc.services/iiif-img/5/2/71df3d52-df5a-4a57-9607-9ecf4dd2197c',
  protocol: 'http://iiif.io/api/image',
  width: 1000,
  height: 1000,
  tiles: [
    {
      width: 256,
      height: 256,
      scaleFactors: [1, 2, 4],
    },
  ],
  sizes: [
    {
      width: 1000,
      height: 1000,
    },
    {
      width: 400,
      height: 400,
    },
    {
      width: 200,
      height: 200,
    },
    {
      width: 100,
      height: 100,
    },
  ],
  profile: [
    'http://iiif.io/api/image/2/level1.json',
    {
      formats: ['jpg'],
      qualities: ['native', 'color', 'gray'],
      supports: [
        'regionByPct',
        'sizeByForcedWh',
        'sizeByWh',
        'sizeAboveFull',
        'rotationBy90s',
        'mirroring',
        'gray',
      ],
    },
  ],
};

class EditableCanvasPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canvas: props.canvas,
    };
  }

  zoomIn = () => {
    if (this.viewport) {
      this.viewport.zoomIn();
    }
  };
  zoomOut = () => {
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
    let { classes, canvas } = this.props;
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
    const ratio = 0.5;
    if (!this.canvas || this.canvas.id !== canvas.id) {
      this.canvas = {
        id: canvas.id,
        getWidth: () => canvas.width,
        getHeight: () => canvas.height,
        __jsonld: canvas,
      };
      this.tileSources = [whiteBG];
    }
    return (
      <div className={classes.root}>
        <div className={classes.canvasBackground}>
          <ContainerDimensions>
            {({ width, height }) => (
              <Viewport
                maxHeight={height}
                setRef={this.setViewport}
                imageUri={whiteBG['@id']}
                tileSources={this.tileSources}
                width={canvas.width}
                height={canvas.height}
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
                          if (xywh.x) {
                            meh.x = xywh.x;
                          }
                          if (xywh.y) {
                            meh.y = xywh.y;
                          }
                          if (xywh.width) {
                            meh.w = xywh.width;
                          }
                          if (xywh.height) {
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
                        <AnnotationBodyRenderer annotation={annotation} />
                      </EditableAnnotation>
                    );
                  })}
                </CanvasRepresentation>
              </Viewport>
            )}
          </ContainerDimensions>
        </div>
        <div className={classes.zoomButtons}>
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
