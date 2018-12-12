import React from 'react';
import langs from 'langs';
import deepmerge from 'deepmerge';

import IIIFReducer from '../../reducers/iiif';
import TextPainting from '../../annotation/TextPainting';
import ImagePainting from '../../annotation/ImagePainting';
import VideoPainting from '../../annotation/VideoPainting';
import AudioPainting from '../../annotation/AudioPainting';

const defaultEditorContext = {
  annotation: {
    'TextualBody::painting': TextPainting,
    'Image::painting': ImagePainting,
    'Video::painting': VideoPainting,
    'Audio::painting': AudioPainting,
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
    languages: langs.all(),
    defaultLanguage: 'en',
  },
};

const EditorContext = React.createContext(defaultEditorContext);
export class EditorProvider extends React.Component {
  render() {
    const { children, configuration } = this.props;
    console.log('deepmerge', deepmerge, deepmerge.all);
    const aggregatedConfig = deepmerge.all([
      defaultEditorContext,
      configuration,
    ]);
    console.log('aggregatedConfig', aggregatedConfig);
    return (
      <EditorContext.Provider value={aggregatedConfig}>
        {children}
      </EditorContext.Provider>
    );
  }
}

EditorProvider.defaultProps = {
  configuration: {},
};

export const EditorConsumer = EditorContext.Consumer;
