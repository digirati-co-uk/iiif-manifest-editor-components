import React from 'react';
import PropTypes from 'prop-types';
import { Toolbar } from '@material-ui/core';
import { EditorConsumer } from '../EditorContext/EditorContext';
import NewAnnotationDialog from '../NewAnnotationDialog/NewAnnotationDialog';
import IIIFReducer from '../../reducers/iiif';
import generateURI from '../../utils/URIGenerator';

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
              addNewResource={data => {
                invokeAction(({ dispatch, state }) => {
                  const newProps = JSON.parse(JSON.stringify(data));
                  if (!newProps.target) {
                    newProps.target =
                      state.selectedIdsByType.Canvas +
                      '#xywh=' +
                      [
                        0,
                        0,
                        data.body ? data.body.width || 300 : 300,
                        data.body ? data.body.height || 200 : 200,
                      ].join(',');
                  }
                  if (!newProps.id) {
                    generateURI(newProps, state.selectedIdsByType.Canvas);
                  }
                  if (!newProps.motivation) {
                    newProps.motivation = this.state.activeAnnotationType.split(
                      '::'
                    )[1];
                  }
                  dispatch(IIIFReducer, {
                    type: 'ADD_SPECIFIC_RESOURCE',
                    options: {
                      props: newProps,
                      parent: state.selectedIdsByType.Canvas,
                    },
                  });
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
