import * as React from 'react';
import ContainerDimensions from 'react-container-dimensions';
import { FormControlLabel, Switch, withStyles } from '@material-ui/core';
import {
  Viewport,
  OpenSeadragonViewport,
  OpenSeadragonViewer,
  CanvasRepresentation,
} from '@canvas-panel/core';
import { addAlphaToHex } from '../../utils/colors';
import EditableAnnotation from '../EditableCanvasPanel/EditableAnnotation';

const style = theme => ({
  boxClass: {
    outline: `1px solid theme.${theme.palette.primary.main}`,
    background: addAlphaToHex(theme.palette.primary.main, 0.6),
  },
});

const imgUrl = iiifUrl =>
  iiifUrl.replace('/info.json', '') + '/full/full/0/default.jpg';

const infoJson = iiifUrl =>
  iiifUrl.endsWith('/info.json') ? iiifUrl : iiifUrl + '/info.json';

class ImageCropper extends React.Component {
  constructor(props) {
    super(props);
    const { iiifUrl, imgWidth, imgHeight } = this.props;
    const imageId = iiifUrl
      ? iiifUrl.replace('/info.json', '') + '/full/full/0/default.jpg'
      : imgUrl;
    this.state = {
      imageId: imageId,
      annotation: {
        target: 'crop',
        x: 0,
        y: 0,
        width: imgWidth,
        height: imgHeight,
      },
    };
  }

  setViewport = v => (this.viewport = v);

  static getDerivedStateFromProps(props, state) {
    const { iiifUrl, imgWidth, imgHeight } = props;
    const imageId = imgUrl(iiifUrl);
    if (state.imageId !== imageId) {
      return {
        imageId,
        annotation: {
          target: 'crop',
          x: 0,
          y: 0,
          width: imgWidth,
          height: imgHeight,
        },
      };
    }
    return null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.iiifUrl !== nextProps.iiifUrl ||
      this.state.annotation.x !== nextState.annotation.x ||
      this.state.annotation.y !== nextState.annotation.y ||
      this.state.annotation.width !== nextState.annotation.width ||
      this.state.annotation.height !== nextState.annotation.height
    );
  }

  render() {
    const {
      classes,
      iiifImageUrl,
      iiifUrl,
      imgWidth,
      imgHeight,
      update,
    } = this.props;
    const imageId = imgUrl(iiifUrl);
    const canvas = {
      id: 'crop',
      type: 'Canvas',
      width: imgWidth,
      height: imgHeight,
      items: [
        {
          type: 'AnnotationPage',
          items: [
            {
              id: imageId,
              type: 'Image',
              width: imgWidth,
              height: imgHeight,
              service: {
                type: 'ImageService2',
                id: iiifUrl,
              },
            },
          ],
        },
      ],
    };
    const imageURLParts = (iiifImageUrl || '').split('/');
    const ratio = 1.0;
    if (
      !this.canvas ||
      this.canvas.id !== canvas.id ||
      this.canvas.width !== canvas.width ||
      this.canvas.height !== canvas.height
    ) {
      this.canvas = {
        id: canvas.id,
        getCanonicalImageUri: width => imageId,
        getWidth: () => canvas.width,
        getHeight: () => canvas.height,
        __jsonld: canvas,
      };
      this.tileSources = [infoJson(iiifUrl) || imgUrl];
    }
    return (
      <div>
        <FormControlLabel
          control={
            <Switch
              checked={
                imageURLParts.length - 4 > 0
                  ? imageURLParts[imageURLParts.length - 4] === 'full'
                  : false
              }
              onChange={(event, checked) => {
                const ann = this.state.annotation;
                imageURLParts[imageURLParts.length - 4] = checked
                  ? `${ann.x},${ann.y},${ann.width},${ann.height}`
                  : 'full';
                this.props.onChange(imageURLParts.join('/'));
              }}
              disabled={!iiifImageUrl || iiifImageUrl === ''}
            />
          }
          label="Cropping/partial display"
        />
        <ContainerDimensions>
          {({ width }) => {
            const cWidth = width;
            const cHeight = (width / canvas.width) * canvas.height;
            return (
              <Viewport
                setRef={this.setViewport}
                imageUri={imgUrl(iiifUrl)}
                tileSources={this.tileSources}
                width={cWidth}
                height={cHeight}
                canvas={this.canvas}
              >
                <OpenSeadragonViewport viewportController={true}>
                  <OpenSeadragonViewer maxHeight={cHeight} maxWidth={cWidth} />
                </OpenSeadragonViewport>
                <CanvasRepresentation ratio={ratio}>
                  {this.state.annotation && (
                    <EditableAnnotation
                      {...this.state.annotation}
                      ratio={ratio}
                      setCoords={xywh => {
                        this.setState(
                          {
                            annotation: {
                              ...this.state.annotation,
                              ...xywh,
                            },
                          },
                          () => {
                            const ann = this.state.annotation;
                            imageURLParts[imageURLParts.length - 4] = `${
                              ann.x
                            },${ann.y},${ann.width},${ann.height}`;
                            this.props.onChange(imageURLParts.join('/'));
                          }
                        );
                      }}
                      className={classes.boxClass}
                    />
                  )}
                </CanvasRepresentation>
              </Viewport>
            );
          }}
        </ContainerDimensions>
      </div>
    );
  }
}

export default withStyles(style)(ImageCropper);
