import * as React from 'react';
import * as PropTypes from 'prop-types';
import { IconButton, Button, Typography, withStyles } from '@material-ui/core';
import DefaultTooltip from '../DefaultTooltip/DefaultTooltip';
import { EditorConsumer } from '../EditorContext/EditorContext';

const style = theme => ({
  text: {
    marginLeft: theme.spacing.unit,
  },
});

const SlimAppBarButton = ({ text, onClick, icon }) => (
  <DefaultTooltip title={text} placement="bottom">
    <IconButton color="secondary" onClick={onClick}>
      {icon}
    </IconButton>
  </DefaultTooltip>
);

const TextAppBarButton = withStyles(style)(({ text, onClick, icon }) => (
  <Button color="secondary" onClick={onClick}>
    {icon}
    <Typography color="secondary" className={classes.text}>
      {text}
    </Typography>
  </Button>
));

const AppBarButton = ({ icon, text, onClick, variant }) => (
  <EditorConsumer>
    {configuration => {
      const buttonType =
        variant || configuration.appBarButtonStyle || 'icon-and-tooltip';
      if (buttonType === 'icon-and-tooltip') {
        return <SlimAppBarButton {...{text, icon, onClick}} />;
      }
      return (
        <TextAppBarButton {...{text, icon, onClick}} />
      );
    }}
  </EditorConsumer>
);

AppBarButton.propTypes = {
  icon: PropTypes.any,
  onClick: PropTypes.func,
  text: PropTypes.string,
  variant: PropTypes.string,
};

AppBarButton.defaultProps = {
  icon: null,
  text: '',
  onClick: () => {},
};

export default AppBarButton;
