import * as React from 'react';
import { InsertComment } from '@material-ui/icons';

import { addResource } from '../utils/addResource';
import renderResource from '../utils/IIIFResource';
import { SIZING_STRATEGY } from '../constants/sizing';
import BaseAnnotation from './BaseAnnotation';
import TextPropertiesForm from './forms/TextPropertiesForm';

export default class TextualBodyDescribing extends BaseAnnotation {
  static formName = 'TextualBodyDescribing';
  static contentRenderer = annotation => '';
  static icon = InsertComment;
  static iconToolTip =  'Text Annotation /w describing';
  static buttonTitle = 'Add Text Annotation /w describing';
  static propertyEditor = TextPropertiesForm;
  static defaultSizing = SIZING_STRATEGY.SCALE_ANNOTATION_TO_CANVAS;
  static defaultBody = {
    type: 'TextualBody',
    value: '',
    format: 'text/plain',
    language: 'en',
  };

  static actions = {
    add: ({ state, dispatch }, options) => {
      if (state.selectedIdsByType.Canvas) {
        const current = TextualBodyDescribing;
        const { width, height } = state.resources[
          state.selectedIdsByType.Canvas
        ];
        addResource(
          state,
          dispatch,
          renderResource('Annotation', {
            parent: state.selectedIdsByType.Canvas,
            props: {
              motivation: 'describing',
              body: current.defaultBody,
              width,
              height,
            },
          }),
          current.defaultSizing
        );
      }
    },
  };
}
