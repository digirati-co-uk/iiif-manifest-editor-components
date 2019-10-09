import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';

import { Label } from './LabelContext.js';

storiesOf('LabelContext', module)
  .addDecorator(withKnobs)
  .add('LabelContext', () => {
    return (
      <Label children={<div>A child node</div>} name={text('Name', 'A name')} />
    );
  });
