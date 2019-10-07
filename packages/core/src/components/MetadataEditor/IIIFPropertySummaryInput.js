import * as React from 'react';
import * as PropTypes from 'prop-types';

import { locale } from '../../utils/IIIFResource';
import IIIFTextField from '../fields/IIIFTextField/IIIFTextField';

const IIIFPropertySummaryInput = ({
  labels,
  update,
  targetEntity,
  lang,
  classes,
  type
}) => (
  <IIIFTextField
    label={labels[type + '.Summary'] || 'Summary'}
    value={locale(targetEntity.summary, lang)}
    onChange={ev =>
      update(
        targetEntity,
        'summary',
        lang,
        ev.target.value
      )
    }
    className={classes.textField}
  />
);

IIIFPropertySummaryInput.propTypes ={
  labels: PropTypes.object,
  update: PropTypes.func,
  targetEntity: PropTypes.object,
  lang: PropTypes.string,
  classes: PropTypes.any,
  type: PropTypes.string,
};

export default IIIFPropertySummaryInput;