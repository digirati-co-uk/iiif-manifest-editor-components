import * as React from 'react';
import * as PropTypes from 'prop-types';
import { IconButton, Button, Typography, withStyles } from '@material-ui/core';
import DefaultTooltip from '../DefaultTooltip/DefaultTooltip';
import { EditorConsumer } from '../EditorContext/EditorContext';

const style = theme => ({
  typo: {
    marginLeft: theme.spacing.unit,
  },
});

const AppBarButton = ({ classes, icon, text, onClick, variant }) => (
  <EditorConsumer>
    {configuration => {
      const buttonType =
        variant || configuration.appBarButtonStyle || 'icon-and-tooltip';
      if (buttonType === 'icon-and-tooltip') {
        return (
          <DefaultTooltip title={text} placement="bottom">
            <IconButton color="secondary" onClick={onClick}>
              {icon}
            </IconButton>
          </DefaultTooltip>
        );
      } else if (buttonType === 'icon-and-label') {
        return (
          <Button color="secondary" onClick={onClick}>
            {icon}
            <Typography color="secondary" className={classes.typo}>
              {text}
            </Typography>
          </Button>
        );
      }
    }}
  </EditorConsumer>
);

AppBarButton.propTypes = {
  classes: PropTypes.any.isRequired,
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

export default withStyles(style)(AppBarButton);
