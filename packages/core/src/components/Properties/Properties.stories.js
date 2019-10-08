import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import Properties from './Properties.js';

storiesOf('Properties', module)
  .addDecorator(withKnobs)
  .add('Properties', () => {
    return (
      <Properties
        mainifest={{}}
        canvas={{}}
        annotation={{}}
        update={() => () => {}}
        noTranslation={boolean('Hide Translation', false)}
      />
    );
  });
