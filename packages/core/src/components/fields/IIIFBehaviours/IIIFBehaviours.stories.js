import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, object, array } from '@storybook/addon-knobs';
import IIIFBehaviours from './IIIFBehaviours.js';
import CheckboxBehaviour from './CheckboxBehaviour';
import FreeTextBehaviour from './FreeTextBehaviour';
import RadioGroupBehaviour from './RadioGroupBehaviour';

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
  })
  .add('RadioGroupBehaviour', () => {
    return (
      <RadioGroupBehaviour
        label={text('Label', 'Radio Button Label')}
        values={array('Values ', [
          'First Option',
          'Second Option',
          'Third Option',
        ])}
        index={1}
        target={object('Target', {})}
        update={() => {}}
        labels={object('Labels', {})}
      />
    );
  });
