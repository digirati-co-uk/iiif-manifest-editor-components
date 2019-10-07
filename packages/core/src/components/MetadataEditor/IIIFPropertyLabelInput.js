import * as React from 'react';
import * as PropTypes from 'prop-types';

import { locale } from '../../utils/IIIFResource';
import IIIFInputField from '../fields/IIIFInputField/IIIFInputField';

const IIIFPropertyLabelInput = ({
  labels,
  update,
  targetEntity,
  lang,
  classes,
  type
}) => (
  <IIIFInputField
    label={labels[type + '.Label'] || 'Label'}
    value={locale(targetEntity.label, lang)}
    onChange={ev =>
      update(
        targetEntity,
        'label',
        lang,
        ev.target.value
      )
    }
    className={classes.textField}
  />
);

IIIFPropertyLabelInput.propTypes ={
  labels: PropTypes.object,
  update: PropTypes.func,
  targetEntity: PropTypes.object,
  lang: PropTypes.string,
  classes: PropTypes.any,
  type: PropTypes.string,
};

export default IIIFPropertyLabelInput;