import * as React from 'react';
import IIIFPropertySummaryInput from './IIIFPropertySummaryInput';

describe("IIIFPropertySummaryInput", () => {
  it('Renders IIIFPropertySummaryInput', () => {
    const handleUpdate = jest.fn();
    const target = {
      behavior: [],
    }
    const languageCode = 'en';
    const type = 'Manifest';
    const labels = {};
    const classes = {};
    const renderedInput = render(
      <IIIFPropertySummaryInput
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
  // TODO: figure out why it is not registering the change the same way as the single line
  // it('Responds on change', () => {
  //   const handleUpdate = jest.fn();
  //   const target = {
  //     summary: {
  //       'en': [
  //         'not test'
  //       ]
  //     }
  //   }
  //   const languageCode = 'en';
  //   const type = 'Manifest';
  //   const labels = {};
  //   const classes = {};
  //   const wrappedInput = mount(
  //     <IIIFPropertySummaryInput
  //       labels={labels}
  //       update={handleUpdate}
  //       targetEntity={target}
  //       lang={languageCode}
  //       type={type}
  //       classes={classes}
  //     />
  //   );
  //   wrappedInput.find('IIIFTextField').simulate('change', 'test');
  //   return (new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve()
  //     }, 1100);
  //   })).then(()=>{
  //     expect(handleUpdate.mock.calls.length).toBe(1);      
  //   });
  // });
});