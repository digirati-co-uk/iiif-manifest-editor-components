import * as React from 'react';
import PropTypes from 'prop-types';

import CheckboxBehaviour from './CheckboxBehaviour';
import RadioGroupBehaviour from './RadioGroupBehaviour';
import FreeTextBehaviour from './FreeTextBehaviour';


const doesHaveMultipleOptions = group => group.length > 1;
const isRadioGroupConfig = group => 
  group.hasOwnProperty('label') &&
  group.hasOwnProperty('values') && 
  Array.isArray(group.values);
const isCustomBehaviourFunction = group => 
  typeof group === 'function' && !group.name;
const isCustomBehaviourComponent = group => 
  typeof group === 'function' && group.name;
const isFreetextBehaviour = group =>
  typeof group === 'string';

const ConfiguredBehaviorRenderer = ({
  groups,
  target,
  update,
  labels
}) => groups.map((group, index) => {
    // Radio
    if (Array.isArray(group)) {
      return doesHaveMultipleOptions(group) ? (
          <RadioGroupBehaviour 
            {...{
              target,
              index,
              values: group,
              labels,
              update,
            }}
          />
        ) : (
          <CheckboxBehaviour
            {...{
                label: group[0],
                target,
                index,
                value: group[0],
                labels,
                update,
            }}
          />
        );
    } else if (isFreetextBehaviour(group)) {
      return (
        <FreeTextBehaviour
          {...{
            target,
            index,
            update,
          }}
        />
      );
    } else if (isRadioGroupConfig(group)) {
      return (
        <RadioGroupBehaviour 
          {...{
            label: group.label,
            target,
            index,
            values: group.values,
            labels,
            update,
          }}
        />
      );
    } else if (isCustomBehaviourFunction(group)) {
      return group({
        target,
        update,
      });
    } else if (isCustomBehaviourComponent(group)) {
      return React.createElement(group.name, {
        target,
        update,
      });
    }
  });

ConfiguredBehaviorRenderer.propTypes = {
  /* array of behaviour selector groups */
  groups: PropTypes.array,
  /* the target resource */ 
  target: PropTypes.object, 
  /* update method */
  update: PropTypes.func,
  /* labels */
  labels: PropTypes.object,
};

ConfiguredBehaviorRenderer.defaultProps = {
  groups: [],
}

export default ConfiguredBehaviorRenderer;