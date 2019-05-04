import * as React from 'react';
import * as PropTypes from 'prop-types';

import IIIFInputField from '../fields/IIIFInputField/IIIFInputField';

const IIIFPropertyRightsInput = ({
  labels,
  update,
  targetEntity,
  classes,
  type
}) => (
  <IIIFInputField
    label={labels[`${type}.Rights`] || 'Rights'}
    className={classes.textField}
    value={targetEntity.rights || ''}
    onChange={ev => update(
      targetEntity,
      'rights',
      null,
      ev.target.value
    )}
  />
);

IIIFPropertyRightsInput.propTypes ={
  labels: PropTypes.object,
  update: PropTypes.func,
  targetEntity: PropTypes.object,
  classes: PropTypes.any,
  type: PropTypes.string,
};

export default IIIFPropertyRightsInput;
