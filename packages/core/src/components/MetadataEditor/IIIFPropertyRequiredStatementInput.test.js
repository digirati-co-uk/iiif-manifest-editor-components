import * as React from 'react';
import IIIFPropertyRequiredStatementInput from './IIIFPropertyRequiredStatementInput';

describe("IIIFPropertyRequiredStatementInput", () => {
  it('Renders IIIFPropertyRequiredStatementInput', () => {
    const handleUpdate = jest.fn();
    const target = {
      behavior: [],
    }
    const languageCode = 'en';
    const type = 'Manifest';
    const labels = {};
    const classes = {};
    const renderedInput = render(
      <IIIFPropertyRequiredStatementInput
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