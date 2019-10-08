import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import Panel from './Panel.js';

storiesOf('Panel', module)
  .addDecorator(withKnobs)
  .add('Panel', () => {
    return <Panel children={<div className="header">something</div>} />;
  });
