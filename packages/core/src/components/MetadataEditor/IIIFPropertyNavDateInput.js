import * as React from 'react';
import * as PropTypes from 'prop-types';
import IIIFInputField from '../fields/IIIFInputField/IIIFInputField';

const IIIFPropertyNavDateInput = ({
  labels,
  update,
  targetEntity,
  classes,
  type
}) => (
  <IIIFInputField
    label={labels[`${type}.NavDate`] || 'Nav Date'}
    type="datetime-local"
    className={classes.textField}
    value={targetEntity.navDate || ''}
    onChange={ev => update(
      targetEntity,
      'navDate',
      null,
      ev.target.value
    )}
    InputLabelProps={{
      shrink: true,
    }}
  />
);

IIIFPropertyNavDateInput.propTypes ={
  labels: PropTypes.object,
  update: PropTypes.func,
  targetEntity: PropTypes.object,
  classes: PropTypes.any,
  type: PropTypes.string,
};

export default IIIFPropertyNavDateInput;
