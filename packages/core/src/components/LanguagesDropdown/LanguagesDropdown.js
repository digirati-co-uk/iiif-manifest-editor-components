import React from 'react';
import langs from 'langs';
import { Select, MenuItem } from '@material-ui/core';

const LanguagesDropdown = ({
  languages = langs.all(),
  lang = 'en',
  changeLanguage,
}) => {
  return (
    <Select value={lang} onChange={ev => changeLanguage(ev.target.value)}>
      {languages.map(language => (
        <MenuItem key={language[1]} value={language[1]}>
          {language.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default LanguagesDropdown;
