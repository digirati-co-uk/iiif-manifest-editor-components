import { queryResourceById, getAnnotationDimensions } from './IIIFResource';
import generateURI from './URIGenerator';
import { SIZING_STRATEGY } from '../constants/sizing';
import IIIFReducer from '../reducers/iiif';
import EditorReducer from '../reducers/editor';

export const addResource = (
  state,
  dispatch,
  data,
  sizingStrategy,
  motivation
) => {
  const newProps = JSON.parse(JSON.stringify(data));
  const canvas = queryResourceById(
    state.selectedIdsByType.Canvas,
    state.rootResource
  );
  const { width, height } = getAnnotationDimensions(data);
  const ratio = width / height;
  if (!newProps.target) {
    if (
      sizingStrategy === SIZING_STRATEGY.SCALE_CANVAS_TO_ANNOTATION ||
      sizingStrategy === SIZING_STRATEGY.NONE
    ) {
      newProps.target =
        state.selectedIdsByType.Canvas +
        '#xywh=' +
        [0, 0, width, height].join(',');
    } else if (sizingStrategy === SIZING_STRATEGY.SCALE_ANNOTATION_TO_CANVAS) {
      const cRatio = canvas.width / canvas.height;
      newProps.target =
        state.selectedIdsByType.Canvas +
        '#xywh=' +
        [
          0,
          0,
          cRatio < ratio ? canvas.width : canvas.height * ratio,
          cRatio < ratio ? canvas.width / ratio : canvas.height,
        ].join(',');
    }
  }
  if (!newProps.id) {
    generateURI(newProps, state.selectedIdsByType.Canvas);
  }
  if (!newProps.motivation) {
    newProps.motivation = motivation; //dialog && dialog.type ? dialog.type.split('::')[1] : '';
  }
  const selectDispatch = () => {
    dispatch(EditorReducer, {
      type: 'TOGGLE_SELECT_RESOURCE',
      resource: newProps,
    });
  };
  dispatch(
    IIIFReducer,
    {
      type: 'ADD_SPECIFIC_RESOURCE',
      options: {
        props: newProps,
        parent: state.selectedIdsByType.Canvas,
      },
    },
    () => {
      if (sizingStrategy === SIZING_STRATEGY.SCALE_CANVAS_TO_ANNOTATION) {
        dispatch(
          IIIFReducer,
          {
            type: 'UPDATE_RESOURCE',
            options: {
              id: state.selectedIdsByType.Canvas,
              props: {
                width: width,
                height: height,
              },
            },
          },
          selectDispatch
        );
      } else {
        selectDispatch();
      }
    }
  );
};
