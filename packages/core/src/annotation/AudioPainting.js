import * as React from 'react';
import { Audiotrack } from '@material-ui/icons';

import { addResource } from '../utils/addResource';
import renderResource from '../utils/IIIFResource';
import BaseAnnotation from './BaseAnnotation';
import AudioPropertiesForm from './forms/AudioPropertiesForm';

export default class AudioPainting extends BaseAnnotation {
  static formName = 'AudioPainting';
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

  static icon = Audiotrack;
  static iconToolTip = 'Audio Annotation';
  static buttonTitle = 'Add Audio Annotation';
  static propertyEditor = AudioPropertiesForm;
  static defaultBody = {
    type: 'Audio',
    id: 'https://www.w3schools.com/html/horse.ogg',
    duration: 1.515102,
  };

  static actions = {
    add: ({ state, dispatch }, options) => {
      if (state.selectedIdsByType.Canvas) {
        const current = AudioPainting;
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
