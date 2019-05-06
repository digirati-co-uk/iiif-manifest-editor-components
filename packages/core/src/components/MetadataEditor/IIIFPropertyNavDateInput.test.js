import * as React from 'react';
import IIIFPropertyNavDateInput from './IIIFPropertyNavDateInput';

describe("IIIFPropertyNavDateInput", () => {
  it('Renders IIIFPropertyNavDateInput', () => {
    const handleUpdate = jest.fn();
    const target = {
      behavior: [],
    }
    const languageCode = 'en';
    const type = 'Manifest';
    const labels = {};
    const classes = {};
    const renderedInput = render(
      <IIIFPropertyNavDateInput
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
  it('Responds on change', () => {
    const handleUpdate = jest.fn();
    const target = {
      behavior: [],
    }
    const languageCode = 'en';
    const type = 'Manifest';
    const labels = {};
    const classes = {};
    const wrappedInput = mount(
      <IIIFPropertyNavDateInput
        labels={labels}
        update={handleUpdate}
        targetEntity={target}
        lang={languageCode}
        type={type}
        classes={classes}
      />
    );
    wrappedInput.find('IIIFInputField').simulate('change', 'test');
    return (new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 1001);
    })).then(()=>{
      expect(handleUpdate.mock.calls.length).toBe(1);      
    });
  });
});