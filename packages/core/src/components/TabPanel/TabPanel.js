import React from 'react';
import Panel from '../Panel/Panel';
import './TabPanel.scss';
import { AppBar, Tabs, Tab } from '@material-ui/core';

class TabPanel extends React.Component {
  state = {
    activeIdx: 0,
  };

  setActiveIndex = (ev, index) => {
    this.setState({
      activeIdx: index,
    });
  };

  getTabName = child => {
    if (typeof child.type === 'string') {
      return child.props.title || child.type;
    } else {
      return (
        child.props.title ||
        (child.type.displayName || '')
          .replace(/WithStyles\(([^)]+)\)/, '$1')
          .replace(/([a-z])([A-Z])/g, '$1 $2')
      );
    }
  };

  render() {
    const { activeIdx } = this.state;
    const { children } = this.props;
    return (
      <Panel>
        <Tabs
          value={activeIdx}
          onChange={this.setActiveIndex}
          indicatorColor="primary"
          textColor="primary"
          scrollable={children.length > 3}
          fullWidth={children.length < 4}
          scrollButtons={children.length < 4 ? 'off' : 'auto'}
        >
          {children.map((child, idx) => (
            <Tab
              key={`tab_${idx}`}
              label={this.getTabName(child)}
              style={{
                minWidth: 140,
              }}
            />
          ))}
        </Tabs>
        <Panel.Content>{children[activeIdx]}</Panel.Content>
      </Panel>
    );
  }
}

export default TabPanel;
