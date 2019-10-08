import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';

import SourcePreviewDialog from './SourcePreviewDialog.js';

storiesOf('SourcePreviewDialog', module)
  .addDecorator(withKnobs)
  .add('SourcePreviewDialogs', () => {
    return (
      <SourcePreviewDialog
        json={text('json', '{}')}
        open={boolean(true, 'Update me')}
        handleClose={() => {}}
      />
    );
  });
