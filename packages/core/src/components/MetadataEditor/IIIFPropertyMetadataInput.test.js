import * as React from 'react';
import IIIFPropertyMetadataInput from './IIIFPropertyMetadataInput';

describe("IIIFPropertyMetadataInput", () => {
  it('Renders IIIFPropertyMetadataInput', () => {
    const handleUpdate = jest.fn();
    const target = {
      behavior: [],
    }
    const languageCode = 'en';
    const type = 'Manifest';
    const labels = {};
    const classes = {};
    const renderedInput = render(
      <IIIFPropertyMetadataInput
        labels={labels}
        update={handleUpdate}
        targetEntity={target}
        lang={languageCode}
        type={type}
        classes={classes}
      />
    );
    expect(renderedInput).toMatchSnapshot();
  });
});