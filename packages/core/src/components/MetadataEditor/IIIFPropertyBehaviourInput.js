import * as React from 'react';
import * as PropTypes from 'prop-types';
import {
  FormControl,
  FormLabel,
} from '@material-ui/core';

import IIIFBehaviours from '../fields/IIIFBehaviours/IIIFBehaviours';

const IIIFPropertyBehaviourInput = ({
  labels,
  update,
  targetEntity,
  lang,
  classes,
  type
}) => (
  <FormControl component="fieldset">
    <FormLabel component="legend">
      {labels[`${type}.Behaviors`] || 'Behaviors'}
    </FormLabel>
    <IIIFBehaviours
      classes={classes}
      target={targetEntity}
      lang={lang}
      update={update}
      labels={labels}
    />
  </FormControl>
)

IIIFPropertyBehaviourInput.propTypes ={
  labels: PropTypes.object,
  update: PropTypes.func,
  targetEntity: PropTypes.object,
  lang: PropTypes.string,
  classes: PropTypes.any,
  type: PropTypes.string,
};

export default IIIFPropertyBehaviourInput;