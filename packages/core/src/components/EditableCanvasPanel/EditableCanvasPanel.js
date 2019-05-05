import * as React from 'react';
import * as PropTypes from 'prop-types';
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
import { isCanvasChangedEditor } from '../../utils/changeDetection';
import styles from './EditableCanvasPanel.styles';

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

  selectItem = item => isSelected => {
    if (!isSelected) {
      this.props.select(item);
    }
  };

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
    
    this.props.update(
      annotation, 
      annotation.target && typeof annotation.target.id === 'string' 
        ? 'target.id'
        : 'target', 
      null, 
      `${canvas.id}${hash}`
    );
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.selectedAnnotation !== this.props.selectedAnnotation ||
      isCanvasChangedEditor(
        nextProps.canvas,
        this.props.canvas,
        id => this.props.resources[id],
        id => nextProps.resources[id]
      )
    );
  }

  setViewport = v => (this.viewport = v);

  getAnnotationClasses = () => {
    const { annotationColor } = this.props;
    return annotationColor === 'primary'
      ? ['boxClass', 'boxClassSelected']
      : ['boxClassSecondary', 'boxClassSecondarySelected']
  };

  getAnnotationList = canvas => 
    canvas && canvas.items ? this.props.resources[canvas.items[0]] : null;
  
  getAnnotations = annotationList => 
    annotationList && annotationList.items
      ? annotationList.items.map(
          annotationId => this.props.resources[annotationId]
        )
      : [];

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

  render() {
    let {
      classes,
      canvas,
      style,
      selectedAnnotation,
    } = this.props;
    const annotationClasses = this.getAnnotationClasses();

    if (!canvas) {
      return (
        <div className={classes.noCanvasSelectedMessage}>
          Please Select A Canvas
        </div>
      );
    }
    const annotationList = this.getAnnotationList(canvas);
    const annotations = this.getAnnotations(annotationList);

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
                              preserveAspectRatio={lockAspectRatio}
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
                              boxStyles={{
                                outlineWidth: this.viewport
                                  ? (this.viewport.getZoom() / 1) * 3
                                  : 3,
                              }}
                              className={
                                classes[
                                  annotation.id === selectedAnnotation
                                    ? annotationClasses[1]
                                    : annotationClasses[0]
                                ]
                              }
                              onClick={() =>
                                this.selectItem(annotation)(
                                  annotation.id === selectedAnnotation
                                )
                              }
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
            )}
          </Droppable>
          {this.renderZoomControls()}
        </div>
      </div>
    );
  }
}

EditableCanvasPanel.propTypes = {
  /* the canvas being displayed  */
  canvas: PropTypes.object,
  /* the annotation selected currently */
  selectedAnnotation: PropTypes.string,
  /* for certain annotation types the aspect ratio 
   needs to be locked due to the behaviour of the OpenSeaDragon */
  lockAspectRatio: PropTypes.array.isRequired,
  /* annotation select callback */
  select: PropTypes.func,
  /* update properties callback */
  update: PropTypes.func,
  /* select between the primary or secondary colour used for the annotations */
  annotationColor: PropTypes.oneOf(['primary', 'secondary']),
  /* all resources in the manifest */
  resources: PropTypes.any,
};

EditableCanvasPanel.defaultProps = {
  canvas: null,
  select: emptyFn,
  update: emptyFn,
  lockAspectRatio: ['Image', 'Video', 'Audio'],
  annotationColor: 'primary',
  resources: {},
};

export default withStyles(styles)(EditableCanvasPanel);
