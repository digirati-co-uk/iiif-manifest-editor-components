import React from 'react';
import PropTypes from 'prop-types';
import { Toolbar } from '@material-ui/core';
import { EditorConsumer } from '../EditorContext/EditorContext';
import NewAnnotationDialog from '../NewAnnotationDialog/NewAnnotationDialog';

class DefaultAnnotationListToolbar extends React.Component {
  state = {
    isNewAnnotationDialogOpen: false,
    activeAnnotationType: null,
  };

  openNewAnnotationDialog = (form, body) => () => {
    this.setState({
      isNewAnnotationDialogOpen: true,
      activeAnnotationType: form,
    });
  };

  closeNewAnnotationDialog = () => {
    this.setState({
      isNewAnnotationDialogOpen: false,
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
                    ? this.openNewAnnotationDialog(config)
                    : invokeAction(config.actions.add),
                  key: `DefaultAnnotationListToolbar_${index}`,
                })
            )}
            <NewAnnotationDialog
              open={this.state.isNewAnnotationDialogOpen}
              form={this.state.activeAnnotationType}
              handleClose={this.closeNewAnnotationDialog}
            />
          </Toolbar>
        )}
      </EditorConsumer>
    );
  }
}

DefaultAnnotationListToolbar.propTypes = {
  doAction: PropTypes.func.isRequired,
};

DefaultAnnotationListToolbar.defaultProps = {
  doAction: () => {},
};

export default DefaultAnnotationListToolbar;
