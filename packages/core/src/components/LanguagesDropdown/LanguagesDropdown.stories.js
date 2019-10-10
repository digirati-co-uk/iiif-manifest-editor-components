import * as React from 'react';
import { storiesOf } from '@storybook/react';

import LanguagesDropdown from './LanguagesDropdown.js';

class LanguagesDropdownWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: 'en',
    };
  }
  changeLanguage = newLang => {
    this.setState({ lang: newLang });
  };
  render() {
    return (
      <LanguagesDropdown
        lang={this.state.lang}
        changeLanguage={this.changeLanguage}
      />
    );
  }
}

storiesOf('LanguagesDropdown', module).add('LanguagesDropdown', () => {
  return <LanguagesDropdownWrapper />;
});
