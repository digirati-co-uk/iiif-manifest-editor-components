import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, object } from '@storybook/addon-knobs';
import IIIFTextField from './IIIFTextField.js';

storiesOf('IIIFTextField', module)
  .addDecorator(withKnobs)
  .add('IIIFTextField with string', () => {
    return (
      <IIIFTextField
        classes={object('Classes', { htmlSwitchWrapper: 'htmlSwitchWrapper' })}
        value={text('Value', 'Some Value')}
        label={text('Label', 'Label')}
      />
    );
  });
