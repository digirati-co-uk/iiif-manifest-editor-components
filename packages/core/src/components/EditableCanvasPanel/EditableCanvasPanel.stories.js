import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import EditableCanvasPanel from './EditableCanvasPanel.js';

storiesOf('EditableCanvasPanel', module)
  .addDecorator(withKnobs)
  .add('EditableCanvasPanel', () => {
    return <EditableCanvasPanel />;
  });
