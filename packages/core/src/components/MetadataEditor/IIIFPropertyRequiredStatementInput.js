import * as React from 'react';
import * as PropTypes from 'prop-types';
import {
  FormControl,
  FormLabel,
} from '@material-ui/core';

import { locale } from '../../utils/IIIFResource';
import IIIFKeyValueField from '../fields/IIIFKeyValueField/IIIFKeyValueField';

const IIIFPropertyRequiredStatementInput = ({
  labels,
  update,
  targetEntity,
  lang,
  keyName,
  type
}) => (
  <FormControl component="fieldset">
    <FormLabel component="legend">
      {labels[type + '.RequiredStatement'] ||
        'Required Statement'}
    </FormLabel>
    <IIIFKeyValueField
      key={`${targetEntity.id}_property_${keyName}:${lang}_input`}
      keyProps={{
        label:
          labels[type + '.RequiredStatement.Label'] ||
          'Label',
        value: locale(
          targetEntity.requiredStatement &&
            targetEntity.requiredStatement.label,
          lang
        ),
        onChange: ev => update(
          targetEntity,
          'requiredStatement.label',
          lang,
          ev.target.value
        ),
      }}
      valueProps={{
        label:
          labels[
            type + 'Metadata.RequiredStatement.Value'
          ] || 'Value',
        value: locale(
          targetEntity.requiredStatement &&
            targetEntity.requiredStatement.value,
          lang
        ),
        onChange: ev => update(
          targetEntity,
          'requiredStatement.value',
          lang,
          ev.target.value
        ),
      }}
    />
  </FormControl>
);

IIIFPropertyRequiredStatementInput.propTypes = {
  labels: PropTypes.object,
  update: PropTypes.func,
  targetEntity: PropTypes.object,
  lang: PropTypes.string,
  keyName: PropTypes.string,
  type: PropTypes.string,
};

export default IIIFPropertyRequiredStatementInput;
