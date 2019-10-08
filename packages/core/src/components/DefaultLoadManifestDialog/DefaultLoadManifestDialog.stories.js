import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import DefaultLoadManifestDialog from './DefaultLoadManifestDialog.js';

storiesOf('DefaultLoadManifestDialog', module)
  .addDecorator(withKnobs)
  .add('DefaultLoadManifestDialog', () => {
    return <DefaultLoadManifestDialog open={boolean('Open', true)} />;
  });
