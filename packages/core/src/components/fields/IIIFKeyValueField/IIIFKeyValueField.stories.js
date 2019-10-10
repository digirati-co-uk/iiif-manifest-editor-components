import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, number } from '@storybook/addon-knobs';
import IIIFKeyValueField from './IIIFKeyValueField.js';

storiesOf('IIIFKeyValueField', module)
  .addDecorator(withKnobs)
  .add('IIIFKeyValueField with string', () => {
    return (
      <IIIFKeyValueField
        classes={{}}
        keyProps={{ value: text('Value', 'Value'), onChange: () => {} }}
        valueProps={{ value: text('Key', 'Key'), onChange: () => {} }}
      />
    );
  })
  .add('IIIFKeyValueField with numberical values', () => {
    return (
      <IIIFKeyValueField
        classes={{}}
        keyProps={{ value: number('Value', 1), onChange: () => {} }}
        valueProps={{ value: number('Key', 2), onChange: () => {} }}
      />
    );
  });
