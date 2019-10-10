import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';
import ManifestEditorAppBar from './ManifestEditorAppBar.js';

storiesOf('ManifestEditorAppBar', module)
  .addDecorator(withKnobs)
  .add('ManifestEditorAppBar', () => {
    return (
      <ManifestEditorAppBar
        title={text('Title', 'Title - Edit me below')}
        titleComponent={text('Title Component', '')}
        titleColor={text('titleColor', 'secondary')}
        children={<div>Children nodes </div>}
      />
    );
  });
