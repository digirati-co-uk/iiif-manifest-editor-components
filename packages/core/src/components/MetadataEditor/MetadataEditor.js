import * as React from 'react';
import * as PropTypes from 'prop-types';
import {
  withStyles,
} from '@material-ui/core';

import { LabelConsumer } from '../LabelContext/LabelContext';

import IIIFPropertyBehaviourInput from './IIIFPropertyBehaviourInput'
import IIIFPropertyLabelInput from './IIIFPropertyLabelInput'
import IIIFPropertyMetadataInput from './IIIFPropertyMetadataInput'
import IIIFPropertyNavDateInput from './IIIFPropertyNavDateInput'
import IIIFPropertyNonStandardField from './IIIFPropertyNonStandardField'
import IIIFPropertyRequiredStatementInput from './IIIFPropertyRequiredStatementInput'
import IIIFPropertyRightsInput from './IIIFPropertyRightsInput'
import IIIFPropertySummaryInput from './IIIFPropertySummaryInput'


const styles = theme => ({
  label: {
    backgorund: '#fff',
  },
});


const FIELD_TYPES = {
  label: IIIFPropertyLabelInput,
  summary: IIIFPropertySummaryInput,
  requiredStatement: IIIFPropertyRequiredStatementInput,
  metadata: IIIFPropertyMetadataInput,
  navDate: IIIFPropertyNavDateInput,
  rights: IIIFPropertyRightsInput,
  behavior: IIIFPropertyBehaviourInput,
};

const MetadataEditor = ({
  classes,
  target,
  lang,
  update,
  fieldConfig,
}) => {
  if (!target) {
    return null;
  }
  const { type } = target;
  const targetEntity = target;
  return (
    <LabelConsumer>
      {labels => fieldConfig.map(keyName => {
        if (typeof keyName === 'string') {
          return React.createElement(
            FIELD_TYPES[keyName] || IIIFPropertyNonStandardField,
            {
              key: `${targetEntity.id}_${keyName}_input:${lang}`,
              labels,
              update,
              targetEntity,
              lang,
              classes, //TODO: don't pass this
              keyName,
              type
            }
          )
        }
      })}
    </LabelConsumer>
  );
};


MetadataEditor.propTypes = {
  /* the resource needs to be edited */
  target: PropTypes.any,
  /* language */
  lang: PropTypes.string,
  /* update */
  update: PropTypes.func,
  fieldConfig: PropTypes.array,
};

MetadataEditor.defaultProps = {
  target: { type: '' },
  lang: 'en',
  update: () => () => {},
  fieldConfig: null,
};

export default withStyles(styles)(MetadataEditor);
