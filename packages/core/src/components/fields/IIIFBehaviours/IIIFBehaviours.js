import * as React from 'react';
import PropTypes from 'prop-types';

import { EditorConsumer } from '../../EditorContext/EditorContext';
import ConfiguredBehaviorRenderer from './ConfiguredBehaviorRenderer';
import DefaultBehaviorListRenderer from './DefaultBehaviorListRenderer';

const IIIFBehavior = ({ target, update, labels }) => (
  <EditorConsumer>
    {configuration => {
      debugger
      const behaviorConfig = configuration.behavior[target.type];
      return behaviorConfig ? (
        <ConfiguredBehaviorRenderer 
          groups={behaviorConfig.groups}
          target={target}
          update={update}
          labels={labels}
        />
      ) : (
        <DefaultBehaviorListRenderer target={target} update={update} />
      ); 
    }}
  </EditorConsumer>
);

IIIFBehavior.propTypes = {
  /* the target resource */ 
  target: PropTypes.object, 
  /* update method */
  update: PropTypes.func,
  /* labels */
  labels: PropTypes.object,
};

export default IIIFBehavior;
