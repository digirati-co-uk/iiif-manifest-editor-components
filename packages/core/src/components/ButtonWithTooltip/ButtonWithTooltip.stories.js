import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';
import ButtonWithTooltip from './ButtonWithTooltip.js';

storiesOf('ButtonWithTooltip', module)
  .addDecorator(withKnobs)
  .add('ButtonWithTooltip with Label', () => {
    return (
      <ButtonWithTooltip
        title={text('title', 'Update me')}
        onClick={() => {}}
        children={<div>I can be an icon or SVG</div>}
        variant={'icon-and-label'}
      />
    );
  });
