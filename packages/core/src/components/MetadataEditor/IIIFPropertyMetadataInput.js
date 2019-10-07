import * as React from 'react';
import * as PropTypes from 'prop-types';
import {
  FormControl,
  FormLabel,
} from '@material-ui/core';

import { locale } from '../../utils/IIIFResource';
import IIIFKeyValueField from '../fields/IIIFKeyValueField/IIIFKeyValueField';

const IIIFPropertyMetadataInput = ({
  labels,
  update,
  targetEntity,
  lang,
  type
}) => (
  <FormControl component="fieldset">
    <FormLabel component="legend">
      {labels[type + '.Metadata'] || 'Metadata'}
    </FormLabel>
    {(targetEntity.metadata || [])
      .concat({
        label: {
          [lang]: '',
        },
        value: {
          [lang]: '',
        },
      })
      .map((metadata, index) => (
        <IIIFKeyValueField
          key={`${targetEntity.id}_metadata_row__${index}:${lang}_input`}
          keyProps={{
            label:
              labels[type + '.Metadata.Label'] || 'Label',
            value: locale(metadata.label, lang),
            onChange: ev => update(
                targetEntity,
                `metadata.${index}.label`,
                lang,
                ev.target.value
              ),
          }}
          valueProps={{
            label:
              labels[type + '.Metadata.Value'] || 'Value',
            value: locale(metadata.value, lang),
            onChange: ev => update(
                targetEntity,
                `metadata.${index}.value`,
                lang,
                ev.target.value
              ),
          }}
        />
      ))}
  </FormControl>
);

IIIFPropertyMetadataInput.propTypes ={
  labels: PropTypes.object,
  update: PropTypes.func,
  targetEntity: PropTypes.object,
  lang: PropTypes.string,
  type: PropTypes.string,
};

export default IIIFPropertyMetadataInput;
