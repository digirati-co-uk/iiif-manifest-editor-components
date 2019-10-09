import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import ManifestEditorDialog from './ManifestEditorDialog.js';

storiesOf('ManifestEditorDialog', module)
  .addDecorator(withKnobs)
  .add('ManifestEditorDialog', () => {
    return (
      <ManifestEditorDialog
        open={boolean('Open', true)}
        title={text('Title', 'A title')}
        handleClose={() => {}}
        fullWidth={boolean('Full Width', true)}
        closeLabel={text('Close Label', 'Accept')}
        children={<div>Children nodes </div>}
      />
    );
  });
