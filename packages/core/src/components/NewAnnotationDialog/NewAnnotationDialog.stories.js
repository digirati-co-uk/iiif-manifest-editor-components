import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';
import NewAnnotationDialog from './NewAnnotationDialog.js';

storiesOf('NewAnnotationDialog', module)
  .addDecorator(withKnobs)
  .add('NewAnnotationDialog', () => {
    return (
      <NewAnnotationDialog form={{ defaultBody: text('Default Body', '') }} />
    );
  });
