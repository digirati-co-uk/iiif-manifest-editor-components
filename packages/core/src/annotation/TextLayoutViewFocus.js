import * as React from 'react';
import { FormatShapes } from '@material-ui/icons';

import { getW3cAnnotationStyle } from '../utils/IIIFResource';
//import IIIFReducer from '../reducers/iiif';
import { addResource } from '../utils/addResource';
import renderResource from '../utils/IIIFResource';
import { SIZING_STRATEGY } from '../constants/sizing';
import BaseAnnotation from './BaseAnnotation';
import ButtonWithTooltip from '../components/ButtonWithTooltip/ButtonWithTooltip';

export default class TextLayoutViewFocus extends BaseAnnotation {
  static formName = 'TextLayoutViewFocus';
  static contentRenderer = annotation => (
    <p
      style={{
        ...getW3cAnnotationStyle(annotation.style || ''),
        pointerEvents: 'none',
      }}
    >
      {annotation.body.value || 'Viewport Focus'}
    </p>
  );

  static button = ({ title = 'Viewport focus', ...props }) => (
    <ButtonWithTooltip title={title} {...props}>
      <FormatShapes />
    </ButtonWithTooltip>
  );

  static icon = FormatShapes;
  static iconToolTip = 'Viewport focus';
  static propertyEditor = null;
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
        const current = TextLayoutViewFocus;
        addResource(
          state,
          dispatch,
          renderResource('Annotation', {
            parent: state.selectedIdsByType.Canvas,
            props: {
              motivation: 'layout-viewport-focus',
              body: current.defaultBody,
            },
          }),
          current.defaultSizing
        );
      }
    },
  };
}
