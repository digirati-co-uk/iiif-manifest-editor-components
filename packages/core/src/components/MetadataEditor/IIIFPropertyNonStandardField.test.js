import * as React from 'react';
import IIIFPropertyNonStandardField from './IIIFPropertyNonStandardField';

describe("IIIFPropertyNonStandardField", () => {
  it('Renders IIIFPropertyNonStandardField', () => {
    const handleUpdate = jest.fn();
    const target = {
      behavior: [],
    }
    const languageCode = 'en';
    const type = 'Manifest';
    const labels = {};
    const classes = {};
    const name = "test";
    const renderedInput = render(
      <IIIFPropertyNonStandardField
        labels={labels}
        update={handleUpdate}
        targetEntity={target}
        lang={languageCode}
        type={type}
        classes={classes}
        keyName={name}
      />
    );
    expect(renderedInput).toMatchSnapshot();
  });
  // it('Responds on change', () => {
  //   const handleUpdate = jest.fn();
  //   const target = {
  //     behavior: [],
  //   }
  //   const languageCode = 'en';
  //   const type = 'Manifest';
  //   const labels = {};
  //   const classes = {};
  //   const name = "test";
  //   const wrappedInput = mount(
  //     <IIIFPropertyNonStandardField
  //       labels={labels}
  //       update={handleUpdate}
  //       targetEntity={target}
  //       lang={languageCode}
  //       type={type}
  //       keyName={name}
  //       classes={classes}
  //     />
  //   );
  //   wrappedInput.find('IIIFInputField').simulate('change', 'test');
  //   return (new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve()
  //     }, 1001);
  //   })).then(()=>{
  //     expect(handleUpdate.mock.calls.length).toBe(1);
  //   });
  // });
});