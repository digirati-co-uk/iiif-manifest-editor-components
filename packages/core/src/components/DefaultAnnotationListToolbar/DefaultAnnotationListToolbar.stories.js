import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import DefaultAnnotationListToolbar from './DefaultAnnotationListToolbar.js';

storiesOf('DefaultAnnotationListToolbar', module)
  .addDecorator(withKnobs)
  .add('DefaultAnnotationListToolbar', () => {
    return (
      <DefaultAnnotationListToolbar
        disableActions={boolean('Disable Actions', false)}
      />
    );
  });
