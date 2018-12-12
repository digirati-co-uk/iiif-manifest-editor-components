import React from 'react';
import { Select, MenuItem } from '@material-ui/core';
import { EditorConsumer } from '../EditorContext/EditorContext';

const LanguagesDropdown = ({ lang = 'en', changeLanguage }) => (
  <EditorConsumer>
    {configuration => (
      <Select value={lang} onChange={ev => changeLanguage(ev.target.value)}>
        {configuration.translation.languages.map(language => (
          <MenuItem key={language[1]} value={language[1]}>
            {language.name}
          </MenuItem>
        ))}
      </Select>
    )}
  </EditorConsumer>
);

export default LanguagesDropdown;
