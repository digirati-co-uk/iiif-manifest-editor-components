import React from 'react';
import { Image } from '@material-ui/icons';

import IIIFReducer from '../reducers/iiif';
import BaseAnnotation from './BaseAnnotation';
import Tooltip from '../components/DefaultTooltip/DefaultTooltip';
import ButtonWithTooltip from '../components/ButtonWithTooltip/ButtonWithTooltip';

import ImagePropertiesForm from './forms/ImagePropertiesForm';

export default class ImagePainting extends BaseAnnotation {
  static contentRenderer = annotation => (
    <img
      src={annotation.body.id || 'https://picsum.photos/g/200/300'}
      alt={annotation.id}
      style={{
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );

  static button = ({ title = 'Add Image Annotation', ...props }) => (
    <ButtonWithTooltip title={title} {...props}>
      <Image />
    </ButtonWithTooltip>
  );

  static icon = ({ color, title = 'Image Annotation' }) => (
    <Tooltip title={title}>
      <Image color={color} />
    </Tooltip>
  );

  static propertyEditor = ImagePropertiesForm;

  static defaultBody = {
    type: 'Image',
    id: 'https://picsum.photos/200/300',
    width: 200,
    height: 300,
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
              body: ImagePainting.defaultBody,
              target: state.selectedIdsByType.Canvas + '#xywh=0,0,200,300',
            },
          },
        });
      }
    },
  };
}
