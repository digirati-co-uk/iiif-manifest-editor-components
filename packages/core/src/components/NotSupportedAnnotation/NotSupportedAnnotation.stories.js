import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { getInternalAnnotationType } from '../../utils/IIIFResource';
import NotSupportedAnnotation from './NotSupportedAnnotation.js';

storiesOf('NotSupportedAnnotation', module)
  .addDecorator(withKnobs)
  .add('NotSupportedAnnotation', () => {
    const annotation = {
      motivation: 'painting',
      body: {
        type: 'TextualBody',
        value: 'test',
      },
    };
    const type = getInternalAnnotationType(annotation);
    return NotSupportedAnnotation(annotation, type);
  });
