import * as React from 'react';
import ContainerDimensions from 'react-container-dimensions';

import {
  Viewport,
  OpenSeadragonViewport,
  OpenSeadragonViewer,
  CanvasRepresentation,
} from '@canvas-panel/core';
import EditableAnnotation from '../EditableCanvasPanel/EditableAnnotation';

const imgUrl = iiifUrl =>
  iiifUrl.replace('/info.json', '') + '/full/full/0/default.jpg';

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

  render() {
    const { iiifUrl, imgWidth, imgHeight } = this.props;
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
      this.tileSources = [iiifUrl || imgUrl];
    }
    return (
      <div>
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
                        this.setState({
                          annotation: {
                            ...this.state.annotation,
                            ...xywh,
                          },
                        });
                      }}
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

export default ImageCropper;
