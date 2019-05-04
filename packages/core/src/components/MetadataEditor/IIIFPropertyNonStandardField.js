
import * as React from 'react';
import * as PropTypes from 'prop-types';

import IIIFInputField from '../fields/IIIFInputField/IIIFInputField';

const IIIFPropertyNonStandardField = ({
  labels,
  update,
  targetEntity,
  lang,
  classes,
  keyName,
  type
}) => {
  const _keyName = keyName.startsWith('_')
  ? keyName.substr(1)
  : keyName;
  return (
    <IIIFInputField
      label={
        labels[`${type}.${_keyName}`] ||
        labels[_keyName] ||
        _keyName
      }
      className={classes.textField}
      value={targetEntity[_keyName] || ''}
      onChange={ev => update(
        targetEntity,
        _keyName,
        keyName.startsWith('_') ? lang : null,
        ev.target.value
      )}
    />
  );
};

IIIFPropertyNonStandardField.propTypes ={
  labels: PropTypes.object,
  update: PropTypes.func,
  targetEntity: PropTypes.object,
  lang: PropTypes.string,
  classes: PropTypes.any,
  keyName: PropTypes.string,
  type: PropTypes.string,
};

export default IIIFPropertyNonStandardField;