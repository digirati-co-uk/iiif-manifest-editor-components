import * as React from 'react';
import { SIZING_STRATEGY } from '../constants/sizing';

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

  static defaultSizing = SIZING_STRATEGY.SCALE_CANVAS_TO_ANNOTATION;

  static actions = {
    add: ({ state, dispatch }, options) => {
      throw 'Not Implemented error';
    },
  };
}

export default BaseAnnotation;
