import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import DLCSExplorer from './DLCSExplorer.js';

storiesOf('DLCSExplorer', module)
  .addDecorator(withKnobs)
  .add('DLCSExplorer', () => {
    return <DLCSExplorer />;
  });
