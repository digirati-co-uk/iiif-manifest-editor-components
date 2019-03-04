import * as React from 'react';
import * as PropTypes from 'prop-types';

import { locale } from '../../utils/IIIFResource';

// Meh... The problem is in this project we need it on deeper levels than the react components
const LocaleString = ({ children, lang, fallback }) =>
  locale(children, lang, fallback);

export default LocaleString;
