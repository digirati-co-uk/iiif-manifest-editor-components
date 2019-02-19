import React from 'react';
import bem from '@fesk/react-bem';

import './ApplicationLayout.scss';

const ApplicationLayout = bem('layout', layout => ({
  Layout: layout,
  Middle: layout.element('middle'),
  Left: layout.element('left'),
  Right: layout.element('right'),
  Center: layout.element('center'),
  Bottom: layout.element('bottom'),
}));

export default ApplicationLayout;
