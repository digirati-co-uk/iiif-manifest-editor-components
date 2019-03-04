import * as React from 'react';
import * as PropTypes from 'prop-types';
import {
  withStyles,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from '@material-ui/core';

import IIIFTextFiled from '../../components/IIIFTextField/IIIFTextField';

import styles from './FormStyles';

class TextPropertiesForm extends React.Component {
  render() {
    const { classes, target, update } = this.props;
    const body = target.body ? target.body.value || '' : '';
    const format = target.body ? target.body.format || '' : '';
    return (
      <div className={classes.root}>
        <RadioGroup
          aria-label="Format"
          name="format"
          className={classes.group}
          value={format}
          onChange={ev => update(target, 'body.format', null, ev.target.value)}
          row
        >
          <FormControlLabel
            value="text/html"
            control={<Radio color="primary" />}
            label="HTML"
            labelPlacement="bottom"
          />
          <FormControlLabel
            value="text/plain"
            control={<Radio color="primary" />}
            label="Plain text"
            labelPlacement="bottom"
          />
        </RadioGroup>
        <IIIFTextFiled
          label="Body Value"
          className={classes.textFieldFullWidth}
          value={body}
          onChange={ev => update(target, 'body.value', null, ev.target.value)}
        />
        {/* <TextField
          label="Body Value"
          className={classes.textFieldFullWidth}
          value={body}
          onChange={ev => update(target, 'body.value', null, ev.target.value)}
          margin="dense"
          variant="outlined"
          multiline={true}
        /> */}
      </div>
    );
  }
}

TextPropertiesForm.propTypes = {
  /** JSS styles */
  classes: PropTypes.object,
  /** target IIIF Resource */
  target: PropTypes.object,
  /** update function */
  update: PropTypes.func,
};

TextPropertiesForm.defaultProps = {};

export default withStyles(styles)(TextPropertiesForm);
