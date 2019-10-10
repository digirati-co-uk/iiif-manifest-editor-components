import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import Panel from './Panel.js';

storiesOf('Panel', module)
  .addDecorator(withKnobs)
  .add('Panel', () => {
    return (
      <Panel horizontal={boolean('horizontal', false)}>
        <Panel.Panel>
          A sub panel
          <Panel.Header>The Header</Panel.Header>
          <Panel.Toolbar>The Toolbar</Panel.Toolbar>
          <Panel.Content>The Content</Panel.Content>
        </Panel.Panel>
      </Panel>
    );
  });
