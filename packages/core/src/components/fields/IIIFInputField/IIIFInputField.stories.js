import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, number } from '@storybook/addon-knobs';
import IIIFInputField from './IIIFInputField.js';

storiesOf('IIIFInputField', module)
  .addDecorator(withKnobs)
  .add('IIIFInputField with string', () => {
    return (
      <IIIFInputField
        value={text('A string value', 'A string value')}
        onChange={() => {}}
      />
    );
  })
  .add('IIIFInputField with number', () => {
    return (
      <IIIFInputField
        value={number('A numerical value', 1)}
        onChange={() => {}}
      />
    );
  });
