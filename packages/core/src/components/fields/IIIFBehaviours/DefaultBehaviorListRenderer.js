import * as React from 'react';
import PropTypes from 'prop-types';

import {
  TextField,
  InputAdornment,
  IconButton,
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';

const DefaultBehaviorListRenderer = ({ target, update }) =>
  (target.behavior || [])
    .concat([''])
    .map((behaviour, idx, arr) => (
      <TextField
        value={behaviour}
        key={`${target.id}.behavior.${idx}`}
        onChange={ev =>
          update(target, `behavior.${idx}`, null, ev.target.value)
        }
        margin="dense"
        variant="outlined"
        InputProps={{
          endAdornment: arr.length - 1 !== idx && (
            <InputAdornment position="end">
              <IconButton
                onClick={() =>
                  update(
                    target,
                    'behavior',
                    null,
                    (target.behavior || []).filter(
                      (el, index) => index !== idx
                    )
                  )
                }
              >
                <Delete />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    ));

DefaultBehaviorListRenderer.propTypes = {
  /* the target resource */ 
  target: PropTypes.object, 
  /* update method */
  update: PropTypes.func,
};

export default DefaultBehaviorListRenderer;
