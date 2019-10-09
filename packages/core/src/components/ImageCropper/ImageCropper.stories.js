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
        //TODO get accurate URL for this component
        iiifUrl={'https://wellcomelibrary.org/iiif/b18035723/'}
      />
    );
  });
