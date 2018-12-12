import React from 'react';
import PropTypes from 'prop-types';
import { Toolbar } from '@material-ui/core';
import { EditorConsumer } from '../EditorContex/EditorContext';

const DefaultAnnotationListToolbar = ({ invokeAction }) => (
  <EditorConsumer>
    {configuration => (
      <Toolbar
        color="secondary"
        style={{
          justifyContent: 'center',
        }}
      >
        {Object.entries(configuration.annotation).map(([type, config], index) =>
          config.button({
            onClick: invokeAction(config.actions.add),
            key: `DefaultAnnotationListToolbar_${index}`,
          })
        )}
      </Toolbar>
    )}
  </EditorConsumer>
);

DefaultAnnotationListToolbar.propTypes = {
  doAction: PropTypes.func.isRequired,
};

DefaultAnnotationListToolbar.defaultProps = {
  doAction: () => {},
};

export default DefaultAnnotationListToolbar;
