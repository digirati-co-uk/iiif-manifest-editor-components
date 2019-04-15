import * as React from './node_modules/react';
import { useState, useEffect } from './node_modules/react';

const IIIFInputField = ({ value, onChange, ...props}) => {
  const [query, setQuery] = useState('');
  const [timer, setTimer] = useState();

  useEffect(() => {
    if (timer) {
      clearTimeout(timer);
    }
    setTimer(setTimeout(() => {
      onChange({
        target: {
          value: query
        }
      });
    }, 1000));
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

export default IIIFInputField;