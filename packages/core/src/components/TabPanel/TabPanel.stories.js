import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';

import TabPanel from './TabPanel.js';

storiesOf('TabPanel', module)
  .addDecorator(withKnobs)
  .add('TabPanel', () => {return null});
