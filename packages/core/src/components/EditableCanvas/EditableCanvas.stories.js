import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import EditableCanvas from './EditableCanvas.js';

storiesOf('EditableCanvas', module)
  .addDecorator(withKnobs)
  .add('EditableCanvas', () => {
    return (
      <EditableCanvas />
    );
  });
