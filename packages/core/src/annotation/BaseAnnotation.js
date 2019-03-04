import * as React from 'react';

class BaseAnnotation {
  static contentRenderer = annotation => {
    throw 'Not Implemented error';
  };

  static button = ({ title = 'button title', ...props }) => {
    throw 'Not Implemented error';
  };

  static icon = ({ color, title = 'Text Annotation' }) => {
    throw 'Not Implemented error';
  };

  static propertyEditor = 'TODO: custom property editor';

  static actions = {
    add: ({ state, dispatch }, options) => {
      throw 'Not Implemented error';
    },
  };
}

export default BaseAnnotation;
