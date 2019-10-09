import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, array } from '@storybook/addon-knobs';
import MetadataEditor from './MetadataEditor.js';

const TEST_CANVAS = {
  id: 'test-canvas-1',
};
const TEST_ANNOTATION = {
  id: 'test-annotation-1',
};
const TEST_MANIFEST = {
  id: 'test-manifest-1',
};
storiesOf('MetadataEditor', module)
  .addDecorator(withKnobs)
  .add('MetadataEditor', () => {
    return (
      <MetadataEditor
        manifest={TEST_MANIFEST}
        canvas={TEST_CANVAS}
        annotation={TEST_ANNOTATION}
        lang={'en'}
        fieldConfig={array('FieldConfig', ['one', 'two', 'three'])}
      />
    );
  });
