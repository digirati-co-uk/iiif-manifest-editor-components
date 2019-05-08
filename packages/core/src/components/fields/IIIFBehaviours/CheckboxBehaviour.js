import * as React from 'react';
import PropTypes from 'prop-types';

import {
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';
import { getLabel } from './utils';

const CheckboxBehaviour = ({
  label,
  value,
  target,
  labels,
  update,
}) => (
  <FormControlLabel
    label={
      getLabel(labels, [
        `${target.type}.behaviour.value.${label}`,
        `Behaviour.value.${label}`
      ], label)
    }
    labelPlacement="end"
    control={
      <Checkbox
        color="primary"
        checked={
          (target.behavior || []).filter(val => val === value)
            .length > 0
        }
        onChange={() => {
          const behaviours = target.behavior || [];
          if (behaviours.indexOf(value) !== -1) {
            update(
              target,
              'behavior',
              null,
              behaviours.filter(val => val !== value)
            );
          } else {
            update(
              target,
              'behavior',
              null,
              [].concat(behaviours).concat(value)
            );
          }
        }}
        value={value}
      />
    }
  />
);

CheckboxBehaviour.propTypes = {
  /* field label */
  label: PropTypes.string,
  /* field value */
  value: PropTypes.string,
  /* the target resource */ 
  target: PropTypes.object, 
  /* update method */
  update: PropTypes.func,
  /* labels */
  labels: PropTypes.object,
};

export default CheckboxBehaviour;