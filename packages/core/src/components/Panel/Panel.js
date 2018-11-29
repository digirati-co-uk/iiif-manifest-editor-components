import React from 'react';
import bem from '@fesk/react-bem';

import './Panel.scss';

const Panel = bem('panel', panel => ({
  Panel: panel.modifier('horizontal'),
  Header: panel.element('header'),
  Toolbar: panel.element('toolbar'),
  Content: panel.element('content'),
}));

export default Panel;
