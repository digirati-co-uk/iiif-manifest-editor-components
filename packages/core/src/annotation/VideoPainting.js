import React from 'react';
import { Videocam } from '@material-ui/icons';

import IIIFReducer from '../reducers/iiif';
import BaseAnnotation from './BaseAnnotation';
import Tooltip from '../components/DefaultTooltip/DefaultTooltip';
import ButtonWithTooltip from '../components/ButtonWithTooltip/ButtonWithTooltip';

import VideoPropertiesForm from './forms/VideoPropertiesForm';

export default class VideoPainting extends BaseAnnotation {
  static contentRenderer = annotation => (
    <video
      controls
      style={{
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <source
        src={
          annotation.body.id ||
          'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
        }
        type="video/mp4"
      />
    </video>
  );

  static button = ({ title = 'Add Video Annotation', ...props }) => (
    <ButtonWithTooltip title={title} {...props}>
      <Videocam />
    </ButtonWithTooltip>
  );

  static icon = ({ color, title = 'Video Annotation' }) => (
    <Tooltip title={title}>
      <Videocam color={color} />
    </Tooltip>
  );

  static propertyEditor = props => VideoPropertiesForm;

  static defaultBody = {
    type: 'Video',
    id: 'https://www.w3schools.com/html/mov_bbb.mp4',
    width: 320,
    height: 176,
    duration: 10.026667,
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
              body: VideoPainting.defaultBody,
              target: state.selectedIdsByType.Canvas + '#xywh=0,0,320,176',
            },
          },
        });
      }
    },
  };
}