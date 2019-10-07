import * as React from 'react'
import * as PropTypes from 'prop-types'
import PanelHeader from './Properties.PanelHeader'


const SimplePanel = ({
  labelKey, 
  label, 
  classes, 
  children 
}) => (
  <div className={classes.resourceBlock}>
    <PanelHeader 
      labelKey={labelKey}
      label={label}
    />
    {children}
  </div>
)

SimplePanel.propTypes = {
  labelKey: PropTypes.string,
  label: PropTypes.string,
  classes: PropTypes.any,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default SimplePanel;
