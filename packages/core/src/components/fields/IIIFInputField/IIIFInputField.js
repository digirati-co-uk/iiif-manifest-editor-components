import * as React from 'react';
import * as PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { TextField } from '@material-ui/core';

import { INPUT_DEBOUNCE_TIME } from '../../../constants/fields';

const IIIFInputField = ({ value, onChange, ...props}) => {
  const [query, setQuery] = useState(value);
  const [timer, setTimer] = useState();

  useEffect(() => {
    if (timer) {
      clearTimeout(timer);
    }
    if (value === query) {
      return;
    }
    setTimer(setTimeout(() => {
      onChange({
        target: {
          value: query
        }
      });
    }, INPUT_DEBOUNCE_TIME));
  }, [query]);

  const handleOnChange = e => setQuery(e.target.value);

  return (
    <TextField
      value={query || value}
      onChange={handleOnChange}
      margin="dense"
      variant="outlined"
      {...props}
    />
  );
};

IIIFInputField.propTypes = {
  /** the fields controlled value, behaves like the normal input field */
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  /** field on change method, behaves as the normal on change, except for the event-target only has value */
  onChange: PropTypes.func,
}

IIIFInputField.defaultProps = {
  onChange: () => {},
};

export default IIIFInputField;