import React from 'react';
import { withStyles, TextField, Button } from '@material-ui/core';

import { getAuthHeader } from './DLCS.utils';

/**
 * @private
 * @class DLCSSearchForm
 * @extends React.Component
 *
 * The component renders a DLCS image search form
 */
export class DLCSSearchForm extends React.Component {
  state = {
    string1: '',
    string2: '',
    string3: '',
    number1: 0,
    number2: 0,
    number3: 0,
  };

  searchFormChange = ev => {
    console.log(ev.target.name, ev.target.value);
    this.setState({
      [ev.target.name]: ev.target.value,
    });
  };

  onSearch = ev => {
    ev.preventDefault();
    const queryString = Object.entries(this.state || {})
      .reduce((acc, [name, value]) => {
        if (
          (name.startsWith('string') && value !== '') ||
          (name.startsWith('number') && value !== 0)
        ) {
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
    return (
      <div style={this.props.style || {}}>
        <TextField
          label="String1"
          type="text"
          name="string1"
          value={string1}
          onChange={this.searchFormChange}
          labelWidth={150}
          margin="dense"
          variant="outlined"
        />
        <TextField
          label="String2"
          type="text"
          name="string2"
          value={string2}
          onChange={this.searchFormChange}
          labelWidth={150}
          margin="dense"
          variant="outlined"
        />
        <TextField
          label="String3"
          type="text"
          name="string3"
          value={string3}
          onChange={this.searchFormChange}
          labelWidth={150}
          margin="dense"
          variant="outlined"
        />
        <TextField
          label="Number1"
          type="number"
          name="number1"
          value={number1}
          onChange={this.searchFormChange}
          labelWidth={150}
          margin="dense"
          variant="outlined"
        />
        <TextField
          label="Number2"
          type="number"
          name="number2"
          value={number2}
          onChange={this.searchFormChange}
          labelWidth={150}
          margin="dense"
          variant="outlined"
        />
        <TextField
          label="Number3"
          type="number"
          name="number3"
          value={number3}
          onChange={this.searchFormChange}
          labelWidth={150}
          margin="dense"
          variant="outlined"
        />
        <Button onClick={this.onSearch}>Search</Button>
      </div>
    );
  }
}
