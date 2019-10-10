import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, array, boolean, optionsKnob } from '@storybook/addon-knobs';
import IIIFBehaviours from './IIIFBehaviours.js';

storiesOf('IIIFBehaviours', module)
  .addDecorator(withKnobs)
  .add('IIIFBehaviours', () => {
    return (
      <IIIFBehaviours
        target={{ type: '' }}
        update={() => {}}
        labels={{ Label1: 'Label1' }}
      />
    );
  });
