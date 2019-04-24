import * as React from 'react';
import { useState } from 'react';
import * as PropTypes from 'prop-types';
import { Toolbar } from '@material-ui/core';
import { EditorConsumer } from '../EditorContext/EditorContext';
import NewAnnotationDialog from '../NewAnnotationDialog/NewAnnotationDialog';
import { addResource } from '../../utils/addResource';

const DefaultAnnotationListToolbar = ({ invokeAction, disableActions }) => {
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
                onClick: () => {
                  if (config.propertyEditor) {
                    setDialog({
                      form: config,
                      type,
                    });
                  } else {
                    invokeAction(config.actions.add)();
                  }
                },
                key: `DefaultAnnotationListToolbar_${index}_${type}`,
                disabled: disableActions,
              })
          )}
          <NewAnnotationDialog
            form={dialog && dialog.form}
            handleClose={() => setDialog(null)}
            addNewResource={(data, sizingStrategy) => {
              // TODO: this shouldn't be part of this component. The component should import and call
              // this function from outside.
              invokeAction(({ dispatch, state }) => {
                addResource(
                  state,
                  dispatch,
                  data,
                  sizingStrategy,
                  dialog && dialog.type ? dialog.type.split('::')[1] : ''
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

DefaultAnnotationListToolbar.propTypes = {
  invokeAction: PropTypes.func.isRequired,
  disableActions: PropTypes.bool,
};

DefaultAnnotationListToolbar.defaultProps = {
  invokeAction: () => {},
  disableActions: false,
};

export default DefaultAnnotationListToolbar;
