import * as React from 'react';
import { withStyles, TextField, Button } from '@material-ui/core';

//import { getAuthHeader } from './DLCS.utils';

const styles = theme => ({
  root: {
    borderBottom: '1px solid #eee',
    borderTop: '1px solid #eee',
  },
  searchFields: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${theme.spacing.unit / 2}`,
  },
  textField: {
    flex: '1',
    marginLeft: theme.spacing.unit / 2,
    marginRight: theme.spacing.unit / 2,
  },
  buttonBar: {
    padding: theme.spacing.unit,
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
});

const LABEL_WIDTH = 150;

/**
 * @private
 * @class DLCSSearchForm
 * @extends React.Component
 *
 * The component renders a DLCS image search form
 */
class DLCSSearchForm extends React.Component {
  state = {
    string1: '',
    string2: '',
    string3: '',
    number1: 0,
    number2: 0,
    number3: 0,
  };

  searchFormChange = ev => {
    this.setState({
      [ev.target.name]: ev.target.value,
    });
  };

  static fieldHasValue = (name, value) =>
    (name.startsWith('string') && value !== '') ||
    (name.startsWith('number') && value !== 0);

  onSearch = ev => {
    ev.preventDefault();
    const queryString = Object.entries(this.state || {})
      .reduce((acc, [name, value]) => {
        if (DLCSSearchForm.fieldHasValue(name, value)) {
          acc.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
        }
        return acc;
      }, [])
      .join('&');

    if (this.props.callback) {
      this.props.callback(queryString);
    }
  };

  render() {
    const { string1, string2, string3, number1, number2, number3 } = this.state;
    const { style, classes } = this.props;

    return (
      <div style={style || {}} className={classes.root}>
        <div className={classes.searchFields}>
          <TextField
            label="String1"
            type="text"
            name="string1"
            value={string1}
            onChange={this.searchFormChange}
            variant="outlined"
            margin="dense"
            InputLabelProps={{ focused: true, shrink: true }}
            className={classes.textField}
          />
          <TextField
            label="String2"
            type="text"
            name="string2"
            value={string2}
            onChange={this.searchFormChange}
            variant="outlined"
            margin="dense"
            InputLabelProps={{ focused: true, shrink: true }}
            className={classes.textField}
          />
          <TextField
            label="String3"
            type="text"
            name="string3"
            value={string3}
            onChange={this.searchFormChange}
            variant="outlined"
            margin="dense"
            InputLabelProps={{ focused: true, shrink: true }}
            className={classes.textField}
          />
        </div>
        <div className={classes.searchFields}>
          <TextField
            label="Number1"
            type="number"
            name="number1"
            value={number1}
            onChange={this.searchFormChange}
            variant="outlined"
            margin="dense"
            InputLabelProps={{ focused: true, shrink: true }}
            className={classes.textField}
          />
          <TextField
            label="Number2"
            type="number"
            name="number2"
            value={number2}
            onChange={this.searchFormChange}
            variant="outlined"
            margin="dense"
            InputLabelProps={{ focused: true, shrink: true }}
            className={classes.textField}
          />
          <TextField
            label="Number3"
            type="number"
            name="number3"
            value={number3}
            onChange={this.searchFormChange}
            variant="outlined"
            margin="dense"
            InputLabelProps={{ focused: true, shrink: true }}
            className={classes.textField}
          />
        </div>
        <div className={classes.buttonBar}>
          <Button onClick={this.onSearch}>Search</Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(DLCSSearchForm);
