import * as React from 'react';
import * as PropTypes from 'prop-types';
import {
  withStyles,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  IconButton,
} from '@material-ui/core';
import { History, ArrowForward } from '@material-ui/icons';
import DefaultTooltip from '../DefaultTooltip/DefaultTooltip';
import style from './IIIFCollectionExplorer.NavBar.style';

class NavBar extends React.Component {
  state = {
    historyOpen: false,
  };

  handleHistoryOpen = () => {
    this.setState({ historyOpen: true });
  };

  handleHistoryClose = () => {
    this.setState({ historyOpen: false });
  };

  render() {
    const {
      classes,
      resourceURL,
      onResourceUrlChange,
      loadedResourceURL,
      history,
      back,
      onLoadResource,
    } = this.props;
    return (
      <div className={classes.head}>
        <div className={classes.headAddressLine}>
          <TextField
            label="Collection or Manifest URL"
            type="url"
            autoComplete="on"
            value={resourceURL}
            onChange={onResourceUrlChange}
            onKeyDown={ev => {
              if (ev.which === 13) {
                onLoadResource();
              }
            }}
            margin="dense"
            variant="outlined"
            className={classes.urlInputStyles}
            InputProps={{
              endAdornment: history.length > 0 && (
                <InputAdornment
                  position="end"
                  onClick={this.handleHistoryOpen}
                  className={classes.historyIconHolder}
                >
                  <DefaultTooltip title="History">
                    <History />
                  </DefaultTooltip>
                </InputAdornment>
              ),
            }}
          />
          <div className={classes.loadResourceIconSpacer}>
            <DefaultTooltip title="Load URL">
              <IconButton onClick={onLoadResource}>
                <ArrowForward />
              </IconButton>
            </DefaultTooltip>
          </div>
        </div>
        <div className={classes.selectHideout}>
          <Select
            open={this.state.historyOpen}
            onClose={this.handleHistoryClose}
            onOpen={this.handleHistoryOpen}
            value={loadedResourceURL}
            onChange={back}
          >
            {history.map(url => (
              <MenuItem key={`history__${url}`} value={url}>
                {url}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
    );
  }
}

export default withStyles(style)(NavBar);
