import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, array, boolean, optionsKnob } from '@storybook/addon-knobs';
import CustomReactQuill from './CustomReactQuill.js';
import CustomReactQuillPopupForm from './CustomReactQuill.PopupForm.js';

const config = {
  toolbar: {
    container: [
      array('Headers', [{ header: [1, 2, false] }]),
      ['bold', 'italic'],
      ['link', 'blockquote', 'image', 'video'],
      [{ list: 'ordered' }, { list: 'bullet' }],
    ],
  },
};
storiesOf('CustomReactQuill', module)
  .addDecorator(withKnobs)
  .add('CustomReactQuill', () => {
    return <CustomReactQuill editorConfig={config} />;
  })
  .add('CustomReactQuill.PopupForm', () => {
    const values = {
      One: 'one',
      Two: 'two',
      Three: 'three',
    };
    return (
      <CustomReactQuillPopupForm
        children={<CustomReactQuill editorConfig={config} />}
        open={boolean('Open', true)}
        classes={optionsKnob(
          'Classes',
          values,
          'one',
          { display: 'inline-radio' },
          'Classes'
        )}
      />
    );
  });
