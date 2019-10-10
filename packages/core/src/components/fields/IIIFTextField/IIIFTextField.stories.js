import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';
import IIIFTextField from './IIIFTextField.js';

storiesOf('IIIFTextField', module)
  .addDecorator(withKnobs)
  .add('IIIFTextField with string', () => {
    return (
      <IIIFTextField
        classes={{}}
        label={text('Label', 'Label')}
      />
    );
  });
