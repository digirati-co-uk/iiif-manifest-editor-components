import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';

import AppBarButton from './AppBarButton.js';

storiesOf('AppBarButton', module)
  .addDecorator(withKnobs)
  .add(
    'AppBarButton with Label',
    () => {
      return (
        <AppBarButton
          icon={':)'}
          text={text('Text', 'Update me')}
          onClick={() => {}}
          variant={'icon-and-label'}
        />
      );
    },
    { notes: 'This is an example of notes added to a story' }
  )
  .add('AppBarButton Slim', () => {
    return (
      <AppBarButton
        icon={':)'}
        text={text('Text', 'Update me')}
        onClick={() => {}}
        variant={'icon-and-tooltip'}
      />
    );
  });
