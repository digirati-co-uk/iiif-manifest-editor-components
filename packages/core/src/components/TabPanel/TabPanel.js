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
        >
          {children.map((child, idx) => (
            <Tab
              key={`tab_${idx}`}
              label={(child.type.displayName || '').replace(
                /WithStyles\(([^)]+)\)/,
                '$1'
              )}
            />
          ))}
        </Tabs>
        <Panel.Content>{children[activeIdx]}</Panel.Content>
      </Panel>
    );
  }
}

export default TabPanel;
