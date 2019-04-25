import * as React from 'react';
import { Videocam } from '@material-ui/icons';

import { addResource } from '../utils/addResource';
import renderResource from '../utils/IIIFResource';
import { SIZING_STRATEGY } from '../constants/sizing';
import BaseAnnotation from './BaseAnnotation';
import ButtonWithTooltip from '../components/ButtonWithTooltip/ButtonWithTooltip';

import VideoPropertiesForm from './forms/VideoPropertiesForm';
import { parseVideo } from '../utils/VideoServices';

export default class VideoPainting extends BaseAnnotation {
  static formName = 'VideoPainting';
  static contentRenderer = annotation => {
    const videoServiceResult = parseVideo(annotation.body.id);
    return videoServiceResult && videoServiceResult.type ? (
      <iframe
        src={videoServiceResult.src}
        style={{
          width: '100%',
          height: '100%',
          border: 0,
          pointerEvents: 'none',
        }}
      />
    ) : (
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
  };

  static button = ({ title = 'Add Video Annotation', ...props }) => (
    <ButtonWithTooltip title={title} {...props}>
      <Videocam />
    </ButtonWithTooltip>
  );

  static icon = Videocam;
  static iconToolTip = 'Video Annotation';
  static propertyEditor = VideoPropertiesForm;
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
        const current = VideoPainting;
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
