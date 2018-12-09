import React from 'react';

const imgStyle = {
  width: '100%',
  height: '100%',
};

const getTextAnnotationStyle = styleStr =>
  styleStr.split(';').reduce((acc, item) => {
    let [key, value] = item.split(':');
    if (key) {
      if (key.trim()) {
        let camelisedKey = key
          .trim()
          .replace(/\-[a-zA-Z]/g, match => match[1].toUpperCase());
        acc[camelisedKey] = value;
      }
    }
    return acc;
  }, {});

const DEFAULT_RENDERERS = {
  'TextualBody::painting': annotation => (
    <p style={getTextAnnotationStyle(annotation.style || '')}>
      {annotation.body.value || 'Text Annotation'}
    </p>
  ),
  'Image::painting': annotation => (
    <img
      src={annotation.body.id || 'https://picsum.photos/g/200/300'}
      alt={annotation.id}
      style={{
        ...imgStyle,
        pointerEvents: 'none',
      }}
    />
  ),
  'Video::painting': annotation => (
    <video controls autoplay name="media" style={imgStyle}>
      <source
        src={
          annotation.body.id ||
          'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
        }
        type="video/mp4"
      />
    </video>
  ),
  'Audio::painting': annotation => (
    <audio controls autoplay>
      <source
        src={annotation.body.id || 'https://www.w3schools.com/tags/horse.ogg'}
        type="audio/ogg"
      />
      Your browser does not support the audio element.
    </audio>
  ),
};

const notSupportedContentType = (annotation, type) => (
  <p style={getTextAnnotationStyle(annotation.style || '')}>
    Annotation type[{type}] not supported.
  </p>
);

const AnnotationBodyRenderer = ({ annotation }) => {
  const type = `${annotation.body.type}::${annotation.motivation}`;
  if (DEFAULT_RENDERERS.hasOwnProperty(type)) {
    return DEFAULT_RENDERERS[type](annotation);
  } else {
    return notSupportedContentType(annotation, type);
  }
};

export default AnnotationBodyRenderer;
