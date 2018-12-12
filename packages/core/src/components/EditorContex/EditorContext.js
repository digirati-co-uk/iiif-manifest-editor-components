import React from 'react';
import { IconButton } from '@material-ui/core';
import { Image, Videocam, Audiotrack, Notes } from '@material-ui/icons';

import Tooltip from '../DefaultTooltip/DefaultTooltip';

import { getW3cAnnotationStyle } from '../../utils/IIIFResource';
import IIIFReducer from '../../reducers/iiif';
const emptyFn = () => {};
const imgStyle = {
  width: '100%',
  height: '100%',
};
const ButtonWithTooltip = ({ title, children, onClick = emptyFn }) => (
  <Tooltip title={title}>
    <IconButton onClick={onClick}>{children}</IconButton>
  </Tooltip>
);

const defaultEditorContext = {
  annotation: {
    'TextualBody::painting': {
      contentRenderer: annotation => (
        <p
          style={{
            ...getW3cAnnotationStyle(annotation.style || ''),
            pointerEvents: 'none',
          }}
        >
          {annotation.body.value || 'Text Annotation'}
        </p>
      ),
      button: ({
        title = 'Add Text Annotation (motivation: painting)',
        ...props
      }) => (
        <ButtonWithTooltip title={title} {...props}>
          <Notes />
        </ButtonWithTooltip>
      ),
      icon: ({ color, title = 'Text Annotation' }) => (
        <Tooltip title={title}>
          <Notes color={color} />
        </Tooltip>
      ),
      actions: {
        add: ({ state, dispatch }, options) => {
          if (state.selectedIdsByType.Canvas) {
            dispatch(IIIFReducer, {
              type: 'ADD_RESOURCE',
              options: {
                type: 'Annotation',
                parent: state.selectedIdsByType.Canvas,
                props: {
                  target: state.selectedIdsByType.Canvas + '#xywh=0,0,200,300',
                },
              },
            });
          }
        },
      },
    },
    'Image::painting': {
      contentRenderer: annotation => (
        <img
          src={annotation.body.id || 'https://picsum.photos/g/200/300'}
          alt={annotation.id}
          style={{
            ...imgStyle,
            pointerEvents: 'none',
          }}
        />
      ),
      button: ({ title = 'Add Image Annotation', ...props }) => (
        <ButtonWithTooltip title={title} {...props}>
          <Image />
        </ButtonWithTooltip>
      ),
      icon: ({ color, title = 'Image Annotation' }) => (
        <Tooltip title={title}>
          <Image color={color} />
        </Tooltip>
      ),
      actions: {
        add: ({ state, dispatch }, options) => {
          if (state.selectedIdsByType.Canvas) {
            dispatch(IIIFReducer, {
              type: 'ADD_RESOURCE',
              options: {
                type: 'Annotation',
                parent: state.selectedIdsByType.Canvas,
                props: {
                  body: {
                    type: 'Image',
                    id: 'https://picsum.photos/200/300',
                    width: 200,
                    height: 300,
                  },
                  target: state.selectedIdsByType.Canvas + '#xywh=0,0,200,300',
                },
              },
            });
          }
        },
      },
    },
    'Video::painting': {
      contentRenderer: annotation => (
        <video
          controls
          style={{
            ...imgStyle,
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
      ),
      button: ({ title = 'Add Video Annotation', ...props }) => (
        <ButtonWithTooltip title={title} {...props}>
          <Videocam />
        </ButtonWithTooltip>
      ),
      icon: ({ color, title = 'Video Annotation' }) => (
        <Tooltip title={title}>
          <Videocam color={color} />
        </Tooltip>
      ),
      actions: {
        add: ({ state, dispatch }, options) => {
          if (state.selectedIdsByType.Canvas) {
            dispatch(IIIFReducer, {
              type: 'ADD_RESOURCE',
              options: {
                type: 'Annotation',
                parent: state.selectedIdsByType.Canvas,
                props: {
                  body: {
                    type: 'Video',
                    id: 'https://www.w3schools.com/html/mov_bbb.mp4',
                    width: 320,
                    height: 176,
                    duration: 10.026667,
                  },
                  target: state.selectedIdsByType.Canvas + '#xywh=0,0,320,176',
                },
              },
            });
          }
        },
      },
    },
    'Audio::painting': {
      contentRenderer: annotation => (
        <audio
          controls
          style={{
            pointerEvents: 'none',
          }}
        >
          <source
            src={
              annotation.body.id || 'https://www.w3schools.com/tags/horse.ogg'
            }
            type="audio/ogg"
          />
          Your browser does not support the audio element.
        </audio>
      ),
      button: ({ title = 'Add Audio Annotation', ...props }) => (
        <ButtonWithTooltip title={title} {...props}>
          <Audiotrack />
        </ButtonWithTooltip>
      ),
      icon: ({ color, title = 'Audio Annotation' }) => (
        <Tooltip title={title}>
          <Audiotrack color={color} />
        </Tooltip>
      ),
      actions: {
        add: ({ state, dispatch }, options) => {
          if (state.selectedIdsByType.Canvas) {
            dispatch(IIIFReducer, {
              type: 'ADD_RESOURCE',
              options: {
                type: 'Annotation',
                parent: state.selectedIdsByType.Canvas,
                props: {
                  body: {
                    type: 'Audio',
                    id: 'https://www.w3schools.com/html/horse.ogg',
                    duration: 1.515102,
                  },
                  target: state.selectedIdsByType.Canvas + '#xywh=0,0,320,176',
                },
              },
            });
          }
        },
      },
    },
  },
  dragDrop: {
    'canvaslist->canvaslist': ({ dispatch }, drop) => {
      dispatch(IIIFReducer, {
        type: 'UPDATE_RESOURCE_ORDER',
        options: {
          id: drop.draggableId,
          startIndex: drop.source.index,
          targetIndex: drop.destination.index,
        },
      });
    },
    'annotationlist->annotationlist': ({ dispatch }, drop) => {
      dispatch(IIIFReducer, {
        type: 'UPDATE_RESOURCE_ORDER',
        options: {
          id: drop.draggableId,
          startIndex: drop.source.index,
          targetIndex: drop.destination.index,
        },
      });
    },
    'dlcsimagelist->annotationlist': ({ dispatch }, drop) => {
      alert('TODO: dlcsimagelist->annotationlist');
    },
    'dlcsimagelist->canvaseditor': ({ dispatch }, drop) => {
      alert('TODO: dlcsimagelist->canvaseditor');
    },
    'iiifimagelist->canvaslist': ({ dispatch }, drop) => {
      console.log('TODO: iiifimagelist->canvaslist');
    },
    'iiifimagelist->annotationlist': ({ dispatch }, drop) => {
      console.log('TODO: iiifimagelist->annotationlist');
    },
    'iiifimagelist->canvaseditor': ({ dispatch }, drop) => {
      console.log('TODO: iiifimagelist->canvaseditor');
    },
  },
  translation: {
    languages: {},
    defaultLanguage: {},
  },
};

const EditorContext = React.createContext(defaultEditorContext);
export class EditorProvider extends React.Component {
  render() {
    const { children, configuration } = this.props;
    return (
      <EditorContext.Provider
        value={{
          ...defaultEditorContext,
          ...configuration,
        }}
      >
        {children}
      </EditorContext.Provider>
    );
  }
}

EditorProvider.defaultProps = {
  configuration: {},
};

export const EditorConsumer = EditorContext.Consumer;
