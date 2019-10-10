import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';

import LocaleString from './LocaleString.js';

storiesOf('LocaleString', module)
  .addDecorator(withKnobs)
  .add('LocaleString', () => {
    return (
      <LocaleString
        lang={text('Language', 'en')}
        fallback={text('Fallback language', 'fr')}
      />
    );
  });
