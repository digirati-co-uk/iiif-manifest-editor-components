import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import ImageCropper from './ImageCropper.js';

storiesOf('ImageCropper', module)
  .addDecorator(withKnobs)
  .add('ImageCropper', () => {
    return (
      <ImageCropper
        imgHeight={300}
        imgWidth={200}
        onChange={() => {}}
        iiifUrl={
          'https://dlcs.io/thumbs/wellcome/1/ff2085d5-a9c7-412e-9dbe-dda87712228d/info.json'
        }
      />
    );
  });
