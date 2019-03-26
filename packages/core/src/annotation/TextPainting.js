import * as React from 'react';
import { Notes } from '@material-ui/icons';

import { getW3cAnnotationStyle } from '../utils/IIIFResource';
// import IIIFReducer from '../reducers/iiif';
import { addResource } from '../utils/addResource';
import renderResource from '../utils/IIIFResource';
import { SIZING_STRATEGY } from '../constants/sizing';
import BaseAnnotation from './BaseAnnotation';
import Tooltip from '../components/DefaultTooltip/DefaultTooltip';
import ButtonWithTooltip from '../components/ButtonWithTooltip/ButtonWithTooltip';

import TextPropertiesForm from './forms/TextPropertiesForm';

export default class TextPainting extends BaseAnnotation {
  static contentRenderer = annotation => (
    <p
      style={{
        ...getW3cAnnotationStyle(annotation.style || ''),
        pointerEvents: 'none',
      }}
    >
      {annotation.body.value || 'Text Annotation'}
    </p>
  );

  static button = ({
    title = 'Text Annotation /w motivation painting',
    ...props
  }) => (
    <ButtonWithTooltip title={title} {...props}>
      <Notes />
    </ButtonWithTooltip>
  );

  static icon = ({
    color,
    title = 'Text Annotation /w motivation painting',
  }) => (
    <Tooltip title={title}>
      <Notes color={color} />
    </Tooltip>
  );

  static propertyEditor = TextPropertiesForm;

  static defaultSizing = SIZING_STRATEGY.NONE;

  static defaultBody = {
    type: 'TextualBody',
    value: 'new annotation',
    format: 'text/plain',
    language: 'en',
  };

  static actions = {
    add: ({ state, dispatch }, options) => {
      if (state.selectedIdsByType.Canvas) {
        const current = TextPainting;
        addResource(
          state,
          dispatch,
          renderResource('Annotation', {
            parent: state.selectedIdsByType.Canvas,
            props: {
              motivation: 'painting',
              body: current.defaultBody,
            },
          }),
          current.defaultSizing
        );
      }
    },
  };
}
