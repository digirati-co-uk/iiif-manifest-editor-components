import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';
import { DragDropContext } from 'react-beautiful-dnd';
import CustomReactQuill from './CustomReactQuill.js';

storiesOf('CustomReactQuill', module)
  .addDecorator(withKnobs)
  .add('CustomReactQuill', () => {
    const config = {
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic'],
          ['link', 'blockquote', 'image', 'video'],
          [{ list: 'ordered' }, { list: 'bullet' }],
        ],
      },
    };

    return <CustomReactQuill editorConfig={config} />;
  });
