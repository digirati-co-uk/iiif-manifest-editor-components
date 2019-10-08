import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import IIIFCollectionExplorer from './IIIFCollectionExplorer.js';

storiesOf('IIIFCollectionExplorer', module)
  .addDecorator(withKnobs)
  .add('IIIFCollectionExplorer', () => {
    return <IIIFCollectionExplorer />;
  });
