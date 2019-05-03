import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { Label } from '../LabelContext/LabelContext';

const PanelHeader = ({
  labelKey,
  label,
}) => (
  <Typography variant="h6">
    <Label name={labelKey}>{label}</Label>
  </Typography>
);

PanelHeader.propTypes = {
  labelKey: PropTypes.string,
  label: PropTypes.string,
}

export default PanelHeader;
