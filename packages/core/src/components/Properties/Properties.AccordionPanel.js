import * as React from 'react'
import * as PropTypes from 'prop-types';
import {
  ExpansionPanelSummary,
  ExpansionPanelDetails,  
} from '@material-ui/core';
import {
  ExpandMore
} from '@material-ui/icons';

import StyledExpansionPanel from './Properties.StyledExpansionPanel';
import PanelHeader from './Properties.PanelHeader';

const AccordionPanel = ({
  defaultExpanded, 
  labelKey, 
  label, 
  classes, 
  children 
}) => (
  <StyledExpansionPanel
    defaultExpanded={defaultExpanded}
  >
    <ExpansionPanelSummary
      expandIcon={<ExpandMore />}
    >
      <PanelHeader 
        labelKey={labelKey}
        label={label}
      />
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
      <div className={classes.resourceBlock}>
        {children}
      </div>
    </ExpansionPanelDetails>
  </StyledExpansionPanel>
);

AccordionPanel.propTypes = {
  labelKey: PropTypes.string,
  label: PropTypes.string,
  defaultExpanded: PropTypes.bool,
  classes: PropTypes.any,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default AccordionPanel;
