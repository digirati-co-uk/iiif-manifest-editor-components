import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';

import AnnotationBodyRenderer from './AnnotationBodyRenderer.js';

storiesOf('AnnotationBodyRenderer', module)
  .addDecorator(withKnobs)
  .add('AnnotationBodyRenderer', () => {
    const annotation = {
      motivation: text('Motivation', 'painting'),
      body: {
        type: text('Type', '3DModel'),
        value: text('Value', 'Value'),
      },
    };
    return <AnnotationBodyRenderer annotation={annotation} />;
  });
