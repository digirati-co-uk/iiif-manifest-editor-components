import React from 'react';
import PropTypes from 'prop-types';
import { Toolbar } from '@material-ui/core';
import { EditorConsumer } from '../EditorContext/EditorContext';
import NewAnnotationDialog from '../NewAnnotationDialog/NewAnnotationDialog';
import IIIFReducer from '../../reducers/iiif';
import generateURI from '../../utils/URIGenerator';
import { SIZING_STRATEGY } from '../../constants/sizing';
import { queryResourceById } from '../../utils/IIIFResource';

const DEFAULT_ANNOTATION_WIDTH = 300;
const DEFAULT_ANNOTATION_HEIGHT = 200;

class DefaultAnnotationListToolbar extends React.Component {
  state = {
    isNewAnnotationDialogOpen: false,
    activeAnnotationForm: null,
    activeAnnotationType: null,
  };

  openNewAnnotationDialog = (form, body, type) => () => {
    this.setState({
      isNewAnnotationDialogOpen: true,
      activeAnnotationForm: form,
      activeAnnotationType: type || null,
    });
  };

  closeNewAnnotationDialog = () => {
    this.setState({
      isNewAnnotationDialogOpen: false,
      activeAnnotationForm: null,
      activeAnnotationType: null,
    });
  };

  render() {
    const { invokeAction } = this.props;
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
                  onClick: config.propertyEditor
                    ? this.openNewAnnotationDialog(config, null, type)
                    : invokeAction(config.actions.add),
                  key: `DefaultAnnotationListToolbar_${index}_${type}`,
                })
            )}
            <NewAnnotationDialog
              open={this.state.isNewAnnotationDialogOpen}
              form={this.state.activeAnnotationForm}
              handleClose={this.closeNewAnnotationDialog}
              addNewResource={(data, sizingStrategy) => {
                invokeAction(({ dispatch, state }) => {
                  console.log('addNewResource', data, sizingStrategy, state);
                  const newProps = JSON.parse(JSON.stringify(data));
                  const canvas = queryResourceById(
                    state.selectedIdsByType.Canvas,
                    state.rootResource
                  );
                  const width = data.body
                    ? data.body.service
                      ? data.body.service.width ||
                        data.body.width ||
                        DEFAULT_ANNOTATION_WIDTH
                      : data.body.width || DEFAULT_ANNOTATION_WIDTH
                    : DEFAULT_ANNOTATION_WIDTH;
                  const height = data.body
                    ? data.body.service
                      ? data.body.service.height ||
                        data.body.height ||
                        DEFAULT_ANNOTATION_HEIGHT
                      : data.body.height || DEFAULT_ANNOTATION_HEIGHT
                    : DEFAULT_ANNOTATION_HEIGHT;
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
                    newProps.motivation = this.state.activeAnnotationType.split(
                      '::'
                    )[1];
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
                  this.closeNewAnnotationDialog();
                })();
              }}
            />
          </Toolbar>
        )}
      </EditorConsumer>
    );
  }
}

DefaultAnnotationListToolbar.propTypes = {
  invokeAction: PropTypes.func.isRequired,
};

DefaultAnnotationListToolbar.defaultProps = {
  invokeAction: () => {},
};

export default DefaultAnnotationListToolbar;
