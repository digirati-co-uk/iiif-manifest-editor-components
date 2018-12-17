import React from 'react';
import { Notes } from '@material-ui/icons';

import { getW3cAnnotationStyle } from '../utils/IIIFResource';
import IIIFReducer from '../reducers/iiif';
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

  static button = ({ title = 'button title', ...props }) => (
    <ButtonWithTooltip title={title} {...props}>
      <Notes />
    </ButtonWithTooltip>
  );

  static icon = ({ color, title = 'Text Annotation' }) => (
    <Tooltip title={title}>
      <Notes color={color} />
    </Tooltip>
  );

  static propertyEditor = TextPropertiesForm;

  static defaultBody = {
    type: 'TextualBody',
    value: 'new annotation',
    format: 'text/plain',
    language: 'en',
  };

  static actions = {
    add: ({ state, dispatch }, options) => {
      if (state.selectedIdsByType.Canvas) {
        dispatch(IIIFReducer, {
          type: 'ADD_RESOURCE',
          options: {
            type: 'Annotation',
            parent: state.selectedIdsByType.Canvas,
            props: {
              body: TextPainting.defaultBody,
              target: state.selectedIdsByType.Canvas + '#xywh=0,0,200,300',
            },
          },
        });
      }
    },
  };
}
