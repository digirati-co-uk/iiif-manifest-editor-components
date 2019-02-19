import React, { useState } from 'react';
import { Tabs, Tab } from '@material-ui/core';

import Panel from '../Panel/Panel';
import { EditorConsumer } from '../EditorContext/EditorContext';
import './TabPanel.scss';

const getTabName = child => {
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

// NOTE: waiting for docz to be compatible with the new React 16.8.x...
const TabPanelHook = ({ children, hideHeaderIfSingleTab }) => {
  console.log('TabPanel - Hook version');
  const [activeIdx, setActiveIndex] = useState(0);
  const tabs = (children || []).filter(child => !!child);
  return (
    <EditorConsumer>
      {configuration => {
        const hideHeaderForSingleTab = configuration.hasOwnProperty(
          'hideHeaderForSingleTab'
        )
          ? configuration.hideHeaderForSingleTab
          : hideHeaderIfSingleTab;
        if (tabs.length === 1 && hideHeaderForSingleTab) {
          return (
            <Panel>
              <Panel.Content>{children[0]}</Panel.Content>
            </Panel>
          );
        }
        return (
          <Panel>
            <Tabs
              value={activeIdx}
              onChange={(ev, index) => setActiveIndex(index)}
              indicatorColor="primary"
              textColor="primary"
              scrollable={children.length > 3}
              fullWidth={children.length < 4}
              scrollButtons={children.length < 4 ? 'off' : 'auto'}
            >
              {tabs.map((child, idx) => (
                <Tab
                  key={`tab_${idx}`}
                  label={getTabName(child)}
                  style={{
                    minWidth: 140,
                  }}
                />
              ))}
            </Tabs>
            <Panel.Content>{children[activeIdx]}</Panel.Content>
          </Panel>
        );
      }}
    </EditorConsumer>
  );
};

class TabPanelComponent extends React.Component {
  state = {
    activeIdx: 0,
  };

  render() {
    console.log('TabPanel - Component version');
    const { children, hideHeaderIfSingleTab } = this.props;
    const { activeIdx } = this.state;
    const tabs = (children || []).filter(child => !!child);
    return (
      <EditorConsumer>
        {configuration => {
          const hideHeaderForSingleTab = configuration.hasOwnProperty(
            'hideHeaderForSingleTab'
          )
            ? configuration.hideHeaderForSingleTab
            : hideHeaderIfSingleTab;
          if (tabs.length === 1 && hideHeaderForSingleTab) {
            return (
              <Panel>
                <Panel.Content>{children[0]}</Panel.Content>
              </Panel>
            );
          }
          return (
            <Panel>
              <Tabs
                value={activeIdx}
                onChange={(ev, index) =>
                  this.setState({
                    activeIdx: index,
                  })
                }
                indicatorColor="primary"
                textColor="primary"
                scrollable={children.length > 3}
                fullWidth={children.length < 4}
                scrollButtons={children.length < 4 ? 'off' : 'auto'}
              >
                {tabs.map((child, idx) => (
                  <Tab
                    key={`tab_${idx}`}
                    label={getTabName(child)}
                    style={{
                      minWidth: 140,
                    }}
                  />
                ))}
              </Tabs>
              <Panel.Content>{children[activeIdx]}</Panel.Content>
            </Panel>
          );
        }}
      </EditorConsumer>
    );
  }
}

const TabPanel =
  typeof useState === 'function' ? TabPanelHook : TabPanelComponent;

export default TabPanel;
