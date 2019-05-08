import * as React from 'react';
import PropTypes from 'prop-types';
import {
  RadioGroup,
  Radio,
  FormLabel,
  FormControl,
  FormControlLabel,
} from '@material-ui/core';

import { getLabel } from './utils';

const RadioGroupBehaviour = ({
  label,
  values,
  index,
  target,
  labels,
  update,
}) => (
  <FormControl component="fieldset">
    <FormLabel component="legend">{label}</FormLabel>
    <RadioGroup
      aria-label={
        getLabel(labels, [
          `${target.type}.behavior.label.` + label,
          `Behaviour.label.` + label
        ], label) 
      }
      value={(target.behavior || [])[index]}
      onChange={ev =>
        update(target, `behavior.${index}`, null, ev.target.value)
      }
      row
    >
      {(values || []).map(value => (
        <FormControlLabel
          key={label + ' ' + value}
          value={value}
          control={<Radio color="primary" />}
          label={
            getLabel(labels,[
              `${target.type}.behavior.value.${value}`,
              `Behavior.value.${value}`
            ], value)
          }
          labelPlacement="end"
        />
      ))}
    </RadioGroup>
  </FormControl>
);

RadioGroupBehaviour.propTypes = {
  /* field label */
  label: PropTypes.string,
  /* field value */
  values: PropTypes.arrayOf(PropTypes.string),
  /* field index */
  index: PropTypes.number,
  /* the target resource */ 
  target: PropTypes.object, 
  /* update method */
  update: PropTypes.func,
  /* labels */
  labels: PropTypes.object,
};

export default RadioGroupBehaviour;