import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import {
  withStyles,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
} from '@material-ui/core';
import { locale } from '../../utils/IIIFResource';

const styles = theme => ({
  label: {
    backgorund: '#fff',
  },
  metadataRow: {
    display: 'flex',
    flexDirection: 'column',
  },
});

const Behavior = ({ config, classes, target, lang, update }) => {
  if (config) {
    return (config.groups || []).map((group, index) => {
      if (Array.isArray(group)) {
        return (
          <RadioGroup
            aria-label={group.label}
            //className={classes.group}
            value={(target.behavior || [])[index]}
            onChange={ev =>
              update(target, `behavior.${index}`, null, ev.target.value)
            }
            row
          >
            {(group || []).map(value => (
              <FormControlLabel
                key={group.label + ' ' + value}
                value={value}
                control={<Radio color="primary" />}
                label={value}
                labelPlacement="end"
              />
            ))}
          </RadioGroup>
        );
      } else if (typeof group === 'string') {
        return (
          <TextField
            label="Freetext behaivor"
            value={(target.behavior || [])[index]}
            onChange={ev =>
              update(target, `behavior.${index}`, null, ev.target.value)
            }
            className={classes.textField}
            margin="dense"
            multiline
            variant="outlined"
          />
        );
      } else if (
        group.hasOwnProperty('label') &&
        group.hasOwnProperty('values')
      ) {
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">{group.label}</FormLabel>
            <RadioGroup
              aria-label={group.label}
              className={classes.group}
              value={(target.behavior || [])[index]}
              onChange={ev =>
                update(target, `behavior.${index}`, null, ev.target.value)
              }
              row
            >
              {(group.values || []).map(value => (
                <FormControlLabel
                  key={group.label + ' ' + value}
                  value={value}
                  control={<Radio color="primary" />}
                  label={value}
                  labelPlacement="end"
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
      } else if (typeof group === 'function' && !group.name) {
        return group({
          target,
          update,
        });
      } else if (typeof group === 'function' && group.name) {
        console.log('group', group, 'group.name', group.name);
        //ReactDOM.createEleme
        return React.createElement(group.name, {
          target,
          update,
          //classes,
        });
      }
    });
  } else {
    return 'Behaviour Placeholder';
  }
};

const MetadataEditor = ({ behaviorConfig, classes, target, lang, update }) => (
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
          <div key={`metadata_row__${index}`} className={classes.metadataRow}>
            <TextField
              label="Label"
              value={locale(metadata.label, lang)}
              onChange={ev =>
                update(target, `metadata.${index}.label`, lang, ev.target.value)
              }
              className={classes.textField}
              margin="dense"
              variant="outlined"
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
    {target.type === 'Manifest' && (
      <TextField
        label="Nav Date"
        type="datetime-local"
        className={classes.textField}
        value={target.navDate || ''}
        onChange={ev => update(target, 'navDate', null, ev.target.value)}
        margin="dense"
        variant="outlined"
        InputLabelProps={{
          shrink: true,
        }}
      />
    )}
    <TextField
      label="Rights"
      className={classes.textField}
      value={target.rights || ''}
      onChange={ev => update(target, 'rights', null, ev.target.value)}
      margin="dense"
      variant="outlined"
    />
    <Behavior
      config={behaviorConfig}
      classes={classes}
      target={target}
      lang={lang}
      update={update}
    />
  </React.Fragment>
);

MetadataEditor.propTypes = {
  target: PropTypes.any,
  /** Language */
  lang: PropTypes.string,
  update: PropTypes.func,
  behaviorConfig: PropTypes.object,
};

MetadataEditor.defaultProps = {
  lang: 'en',
  update: () => () => {},
};

export default withStyles(styles)(MetadataEditor);
