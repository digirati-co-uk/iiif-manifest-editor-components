import React from 'react';

/**
 * @class DLCSImageThumbnail
 * @extends React.Component
 *
 * The components render a dlcs image preview
 */
export class DLCSImageThumbnail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
    };
    this.onImageLoadError = this.onImageLoadError.bind(this);
    this.getPreviewUrl = this.getPreviewUrl.bind(this);
    this.getImageInfoUrl = this.getImageInfoUrl.bind(this);
  }

  onImageLoadError() {
    this.setState({
      error: true,
    });
  }

  getPreviewUrl(image) {
    const iiifInfoUrl = this.getImageInfoUrl(image);
    return `${iiifInfoUrl}/full/!100,100/0/default.jpg`;
  }

  getImageInfoUrl(image) {
    return image['@id']
      .replace('api.', '')
      .replace('/customers/', '/thumbs/')
      .replace('/spaces/', '/')
      .replace('/images/', '/');
  }

  render() {
    let imageInfoUrl = this.getImageInfoUrl(this.props.image);
    let imageOnClick = this.props.imageOnClick
      ? this.props.imageOnClick
      : ev => ev.preventDefault();
    let imageLoadError = this.state.error;
    let thumbnailUrl = this.getPreviewUrl(this.props.image);
    const image = this.props.image;
    const imageClickWrap = ev => imageOnClick(ev, image);
    return (
      <a href={imageInfoUrl} onClick={imageClickWrap}>
        {imageLoadError ? (
          <span className="broken-image" title={this.props.image['@id']} />
        ) : (
          <img src={thumbnailUrl} onError={this.onImageLoadError} />
        )}
      </a>
    );
  }
}
