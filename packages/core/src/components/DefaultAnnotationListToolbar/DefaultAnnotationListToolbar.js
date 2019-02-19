import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Toolbar } from '@material-ui/core';
import { EditorConsumer } from '../EditorContext/EditorContext';
import NewAnnotationDialog from '../NewAnnotationDialog/NewAnnotationDialog';
import IIIFReducer from '../../reducers/iiif';
import generateURI from '../../utils/URIGenerator';
import { SIZING_STRATEGY } from '../../constants/sizing';
import {
  queryResourceById,
  getAnnotationDimensions,
} from '../../utils/IIIFResource';

// NOTE: waiting for docz to be compatible with the new React 16.8.x...
const DefaultAnnotationListToolbarHook = ({ invokeAction }) => {
  const [dialog, setDialog] = useState(null);
  return (
    <EditorConsumer>
      {configuration => (
        <Toolbar
          color="secondary"
          style={{
            justifyContent: 'center',
          }}
        >
          {Object.entries(configuration.annotation).map(
            ([type, config], index) =>
              config.button({
                onClick: () =>
                  config.propertyEditor
                    ? setDialog({
                        form: config,
                        type,
                      })
                    : invokeAction(config.actions.add),
                key: `DefaultAnnotationListToolbar_${index}_${type}`,
              })
          )}
          <NewAnnotationDialog
            form={dialog && dialog.form}
            handleClose={() => setDialog(null)}
            addNewResource={(data, sizingStrategy) => {
              // TODO: this shouldn't be part of this component. The component should import and call
              // this function from outside.
              invokeAction(({ dispatch, state }) => {
                const newProps = JSON.parse(JSON.stringify(data));
                const canvas = queryResourceById(
                  state.selectedIdsByType.Canvas,
                  state.rootResource
                );
                const { width, height } = getAnnotationDimensions(data);
                const ratio = width / height;
                if (!newProps.target) {
                  if (
                    sizingStrategy ===
                      SIZING_STRATEGY.SCALE_CANVAS_TO_ANNOTATION ||
                    sizingStrategy === SIZING_STRATEGY.NONE
                  ) {
                    newProps.target =
                      state.selectedIdsByType.Canvas +
                      '#xywh=' +
                      [0, 0, width, height].join(',');
                  } else if (
                    sizingStrategy ===
                    SIZING_STRATEGY.SCALE_ANNOTATION_TO_CANVAS
                  ) {
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
                  newProps.motivation =
                    dialog && dialog.type ? dialog.type.split('::')[1] : '';
                }
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
                    if (
                      sizingStrategy ===
                      SIZING_STRATEGY.SCALE_CANVAS_TO_ANNOTATION
                    ) {
                      dispatch(IIIFReducer, {
                        type: 'UPDATE_RESOURCE',
                        options: {
                          id: state.selectedIdsByType.Canvas,
                          props: {
                            width: width,
                            height: height,
                          },
                        },
                      });
                    }
                  }
                );
                setDialog(null);
              })();
            }}
          />
        </Toolbar>
      )}
    </EditorConsumer>
  );
};

class DefaultAnnotationListToolbarComponent extends React.Component {
  state = {
    dialog: null,
  };

  render() {
    const { invokeAction } = this.props;
    const { dialog } = this.state;
    return (
      <EditorConsumer>
        {configuration => (
          <Toolbar
            color="secondary"
            style={{
              justifyContent: 'center',
            }}
          >
            {Object.entries(configuration.annotation).map(
              ([type, config], index) =>
                config.button({
                  onClick: () =>
                    config.propertyEditor
                      ? this.setState({
                          dialog: {
                            form: config,
                            type,
                          },
                        })
                      : invokeAction(config.actions.add),
                  key: `DefaultAnnotationListToolbar_${index}_${type}`,
                })
            )}
            <NewAnnotationDialog
              form={dialog && dialog.form}
              handleClose={() =>
                this.setState({
                  dialog: null,
                })
              }
              addNewResource={(data, sizingStrategy) => {
                // TODO: this shouldn't be part of this component. The component should import and call
                // this function from outside.
                invokeAction(({ dispatch, state }) => {
                  const newProps = JSON.parse(JSON.stringify(data));
                  const canvas = queryResourceById(
                    state.selectedIdsByType.Canvas,
                    state.rootResource
                  );
                  const { width, height } = getAnnotationDimensions(data);
                  const ratio = width / height;
                  if (!newProps.target) {
                    if (
                      sizingStrategy ===
                        SIZING_STRATEGY.SCALE_CANVAS_TO_ANNOTATION ||
                      sizingStrategy === SIZING_STRATEGY.NONE
                    ) {
                      newProps.target =
                        state.selectedIdsByType.Canvas +
                        '#xywh=' +
                        [0, 0, width, height].join(',');
                    } else if (
                      sizingStrategy ===
                      SIZING_STRATEGY.SCALE_ANNOTATION_TO_CANVAS
                    ) {
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
                    newProps.motivation =
                      dialog && dialog.type ? dialog.type.split('::')[1] : '';
                  }
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
                      if (
                        sizingStrategy ===
                        SIZING_STRATEGY.SCALE_CANVAS_TO_ANNOTATION
                      ) {
                        dispatch(IIIFReducer, {
                          type: 'UPDATE_RESOURCE',
                          options: {
                            id: state.selectedIdsByType.Canvas,
                            props: {
                              width: width,
                              height: height,
                            },
                          },
                        });
                      }
                    }
                  );
                  this.setState({
                    dialog: null,
                  });
                })();
              }}
            />
          </Toolbar>
        )}
      </EditorConsumer>
    );
  }
}

const DefaultAnnotationListToolbar =
  typeof useState === 'function'
    ? DefaultAnnotationListToolbarHook
    : DefaultAnnotationListToolbarComponent;

DefaultAnnotationListToolbar.propTypes = {
  invokeAction: PropTypes.func.isRequired,
};

DefaultAnnotationListToolbar.defaultProps = {
  invokeAction: () => {},
};

export default DefaultAnnotationListToolbar;
