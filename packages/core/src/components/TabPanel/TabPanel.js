import React from 'react';
import Panel from '../Panel/Panel';
import './TabPanel.scss';

class TabPanel extends React.Component {
  state = {
    activeIdx: 0,
  };

  setActiveIndex = index => () => {
    this.setState({
      activeIdx: index,
    });
  };

  render() {
    const { activeIdx } = this.state;
    const { children } = this.props;
    return (
      <Panel>
        <Panel.Toolbar>
          <div className="tab-toolbar">
            {children.map((child, idx) => {
              return (
                <a
                  className={
                    'tab-toolbar__item' +
                    (idx === activeIdx ? ' tab-toolbar__item--active' : '')
                  }
                  onClick={this.setActiveIndex(idx)}
                >
                  {child.type.displayName}
                </a>
              );
            })}
          </div>
        </Panel.Toolbar>
        <Panel.Content>{children[activeIdx]}</Panel.Content>
      </Panel>
    );
  }
}

export default TabPanel;
