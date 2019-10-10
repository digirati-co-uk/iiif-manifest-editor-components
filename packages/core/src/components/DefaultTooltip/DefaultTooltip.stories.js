import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';

import DefaultTooltip from './DefaultTooltip.js';

storiesOf('DefaultTooltip', module)
  .addDecorator(withKnobs)
  .add('DefaultTooltip', () => {
    return (
      <DefaultTooltip
        title={text('Text', 'Update me')}
        children={<div>Hover over me</div>}
        variant={'icon-and-label'}
      />
    );
  });
