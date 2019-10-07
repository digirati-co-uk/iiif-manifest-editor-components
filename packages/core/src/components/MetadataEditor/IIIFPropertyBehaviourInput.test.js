import * as React from 'react';
import IIIFPropertyBehaviourInput from './IIIFPropertyBehaviourInput';

describe("IIIFPropertyBehaviourInput", () => {
  it('Renders IIIFPropertyBehaviourInput', () => {
    const handleUpdate = jest.fn();
    const target = {
      behavior: [],
    }
    const languageCode = 'en';
    const type = 'Manifest';
    const labels = {};
    const classes = {};
    const renderedInput = render(
      <IIIFPropertyBehaviourInput
        classes={classes}
        labels={labels}
        update={handleUpdate}
        targetEntity={target}
        lang={languageCode}
        type={type}
      />
    );
    expect(renderedInput).toMatchSnapshot();
  });
  //TODO: on change????
});