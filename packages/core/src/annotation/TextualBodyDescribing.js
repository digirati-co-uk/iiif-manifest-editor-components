import * as React from 'react';
import { InsertComment } from '@material-ui/icons';

import { addResource } from '../utils/addResource';
import renderResource from '../utils/IIIFResource';
import { queryResourceById } from '../utils/IIIFResource';
import { SIZING_STRATEGY } from '../constants/sizing';
import BaseAnnotation from './BaseAnnotation';
import Tooltip from '../components/DefaultTooltip/DefaultTooltip';
import ButtonWithTooltip from '../components/ButtonWithTooltip/ButtonWithTooltip';
import TextPropertiesForm from './forms/TextPropertiesForm';

export default class TextualBodyDescribing extends BaseAnnotation {
  static formName = 'TextualBodyDescribing';
  static contentRenderer = annotation => '';

  static button = ({ title = 'Text Annotation /w describing', ...props }) => (
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
        const { width, height } = queryResourceById(
          state.selectedIdsByType.Canvas,
          state.rootResource
        );
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
