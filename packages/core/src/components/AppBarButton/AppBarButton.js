import * as React from 'react';
import * as PropTypes from 'prop-types';
import { EditorConsumer } from '../EditorContext/EditorContext';
import SlimAppBarButton from './AppBarButton.Slim';
import TextAppBarButton from './AppBarButton.Text';

const BUTTON_TYPES = {
  'icon-and-tooltip': SlimAppBarButton,
  'icon-and-label': TextAppBarButton
};

const AppBarButton = ({ icon, text, onClick, variant }) => (
  <EditorConsumer>
    {configuration => {
      const buttonType = BUTTON_TYPES[variant] || 
        BUTTON_TYPES[configuration.appBarButtonStyle] ||
        BUTTON_TYPES['icon-and-tooltip'];
      return React.createElement(buttonType, {text, icon, onClick});
    }}
  </EditorConsumer>
);

AppBarButton.propTypes = {
  /* icon component used for the app bar button */
  icon: PropTypes.element,
  /* click event handler */
  onClick: PropTypes.func,
  /* button text */
  text: PropTypes.string,
  /* the button ui needs to be used */
  variant: PropTypes.oneOf(Object.keys(BUTTON_TYPES)),
};

AppBarButton.defaultProps = {
  icon: null,
  text: '',
  onClick: () => {},
};

export default AppBarButton;
