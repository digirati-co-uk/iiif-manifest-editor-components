import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';

import AnnotationBodyRenderer from './AnnotationBodyRenderer.js';

storiesOf('AnnotationBodyRenderer', module)
  .addDecorator(withKnobs)
  .add('AnnotationBodyRenderer', () => {
    const annotation = {
      motivation: 'painting',
      body: {
        type: '3DModel',
      },
    };
    return <AnnotationBodyRenderer annotation={annotation} />;
  });
