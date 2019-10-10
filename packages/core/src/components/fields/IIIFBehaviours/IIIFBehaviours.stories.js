import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, object } from '@storybook/addon-knobs';
import IIIFBehaviours from './IIIFBehaviours.js';
import CheckboxBehaviour from './CheckboxBehaviour';
import FreeTextBehaviour from './FreeTextBehaviour';

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
  })
  .add('CheckboxBehaviour', () => {
    return (
      <CheckboxBehaviour
        label={text('Label', 'Label')}
        value={text(' Value', 'Value')}
        target={object('Target', {})}
        update={() => {}}
        labels={object('Labels', {})}
      />
    );
  })
  .add('FreeTextBehaviour', () => {
    return <FreeTextBehaviour target={{}} update={() => {}} index={1} />;
  });
