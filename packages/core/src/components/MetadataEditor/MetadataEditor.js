import React from 'react';
import PropTypes from 'prop-types';
import {
  withStyles,
  TextField,
  FormControl,
  FormLabel,
} from '@material-ui/core';
import { locale } from '../../utils/IIIFResource';

const styles = theme => ({
  label: {
    backgorund: '#fff',
  },
});

const MetadataEditor = ({ classes, target, lang, update }) => (
  <React.Fragment>
    <TextField
      label="Label"
      value={locale(target.label, lang)}
      onChange={ev => update(target, 'label', lang, ev.target.value)}
      className={classes.textField}
      margin="dense"
      variant="outlined"
    />
    <TextField
      label="Summary"
      value={locale(target.summary, lang)}
      onChange={ev => update(target, 'summary', lang, ev.target.value)}
      className={classes.textField}
      margin="dense"
      multiline
      variant="outlined"
    />
    <FormControl component="fieldset">
      <FormLabel component="legend">Required Statement</FormLabel>
      <TextField
        label="Label"
        value={locale(
          target.requiredStatement && target.requiredStatement.label,
          lang
        )}
        onChange={ev =>
          update(target, 'requiredStatement.label', lang, ev.target.value)
        }
        className={classes.textField}
        margin="dense"
        variant="outlined"
      />
      <TextField
        label="Value"
        value={locale(
          target.requiredStatement && target.requiredStatement.value,
          lang
        )}
        onChange={ev =>
          update(target, 'requiredStatement.value', lang, ev.target.value)
        }
        className={classes.textField}
        margin="dense"
        multiline
        variant="outlined"
      />
    </FormControl>
    <FormControl component="fieldset">
      <FormLabel component="legend">Metadata</FormLabel>
      {(target.metadata || [])
        .concat({
          label: {
            [lang]: '',
          },
          value: {
            [lang]: '',
          },
        })
        .map((metadata, index) => (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <TextField
              label="Label"
              value={locale(metadata.label, lang)}
              onChange={ev =>
                update(target, `metadata.${index}.label`, lang, ev.target.value)
              }
              className={classes.textField}
              margin="dense"
            />
            <TextField
              label="Value"
              value={locale(metadata.value, lang)}
              onChange={ev =>
                update(target, `metadata.${index}.value`, lang, ev.target.value)
              }
              className={classes.textField}
              margin="dense"
              multiline
              variant="outlined"
            />
          </div>
        ))}
    </FormControl>
    {/* TODO: key value pair table here */}
  </React.Fragment>
);

MetadataEditor.propTypes = {
  target: PropTypes.any,
  /** Language */
  lang: PropTypes.string,
  update: PropTypes.func,
};

MetadataEditor.defaultProps = {
  lang: 'en',
  update: () => () => {},
};

export default withStyles(styles)(MetadataEditor);
