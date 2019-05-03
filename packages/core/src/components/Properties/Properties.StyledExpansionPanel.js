import * as React from 'react'
import { 
  ExpansionPanel,
  withStyles 
} from '@material-ui/core';

const StyledExpansionPanel = withStyles(theme => ({
  root: {
    borderLeft: 0,
    borderRight: 0,
    borderTop: '1px solid rgba(0,0,0,.125)',
    borderBottom: '1px solid rgba(0,0,0,.125)',
    boxShadow: 'none',
    margin: `0 -${2 * theme.spacing.unit}px`,
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  },
  expanded: {
    margin: `auto -${2 * theme.spacing.unit}px`,
  },
}))(ExpansionPanel);

export default StyledExpansionPanel;