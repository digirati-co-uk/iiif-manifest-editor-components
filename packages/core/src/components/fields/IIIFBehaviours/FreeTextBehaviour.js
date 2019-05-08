import * as React from 'react';
import PropTypes from 'prop-types';

import { TextField } from '@material-ui/core';

const FreeTextBehaviour = ({
  target,
  index,
  update,
}) => (
  <TextField
    label="Freetext behavior"
    value={(target.behavior || [])[index]}
    onChange={ev =>
      update(target, `behavior.${index}`, null, ev.target.value)
    }
    margin="dense"
    variant="outlined"
  />
);

FreeTextBehaviour.propTypes = {
  /* the target resource */ 
  target: PropTypes.object, 
  /* update method */
  update: PropTypes.func,
  /* item index */
  index: PropTypes.number,
};

export default FreeTextBehaviour;
