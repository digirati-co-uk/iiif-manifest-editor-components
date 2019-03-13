import * as React from 'react';
import { InsertComment } from '@material-ui/icons';

import { 
  DefaultTooltip as Tooltip,
  ButtonWithTooltip,
  BaseAnnotation,
  IIIFReducer,
  TextPropertiesForm
} from '@IIIF-MEC/core';

export default class TextualBodyDescribing extends BaseAnnotation {
  static contentRenderer = annotation => ('');

  static button = ({
    title = 'Text Annotation /w describing',
    ...props
  }) => (
    <ButtonWithTooltip title={title} {...props}>
      <InsertComment />
    </ButtonWithTooltip>
  );

  static icon = ({ color, title = 'Text Annotation /w describing' }) => (
    <Tooltip title={title}>
      <InsertComment color={color} />
    </Tooltip>
  );

  static propertyEditor = TextPropertiesForm;

  static defaultBody = {
    type: 'TextualBody',
    value: '',
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
              motivation: 'describing',
              body: TextPainting.defaultBody,
              target: state.selectedIdsByType.Canvas + '#xywh=0,0,200,300',
            },
          },
        });
      }
    },
  };
}
