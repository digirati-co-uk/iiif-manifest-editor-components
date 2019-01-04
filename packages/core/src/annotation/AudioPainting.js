import React from 'react';
import { Audiotrack } from '@material-ui/icons';

import IIIFReducer from '../reducers/iiif';
import BaseAnnotation from './BaseAnnotation';
import Tooltip from '../components/DefaultTooltip/DefaultTooltip';
import ButtonWithTooltip from '../components/ButtonWithTooltip/ButtonWithTooltip';

import AudioPropertiesForm from './forms/AudioPropertiesForm';

export default class AudioPainting extends BaseAnnotation {
  static contentRenderer = annotation => (
    <audio
      controls
      style={{
        pointerEvents: 'none',
      }}
    >
      <source
        src={annotation.body.id || 'https://www.w3schools.com/tags/horse.ogg'}
        type="audio/ogg"
      />
      Your browser does not support the audio element.
    </audio>
  );

  static button = ({ title = 'Add Audio Annotation', ...props }) => (
    <ButtonWithTooltip title={title} {...props}>
      <Audiotrack />
    </ButtonWithTooltip>
  );

  static icon = ({ color, title = 'Audio Annotation' }) => (
    <Tooltip title={title}>
      <Audiotrack color={color} />
    </Tooltip>
  );

  static propertyEditor = AudioPropertiesForm;

  static defaultBody = {
    type: 'Audio',
    id: 'https://www.w3schools.com/html/horse.ogg',
    duration: 1.515102,
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
              body: AudioPainting.defaultBody,
              target: state.selectedIdsByType.Canvas + '#xywh=0,0,320,176',
            },
          },
        });
      }
    },
  };
}
