import * as React from 'react';
import {
  TextField,
  RadioGroup,
  Radio,
  Checkbox,
  FormLabel,
  FormControl,
  FormControlLabel,
  InputAdornment,
  IconButton,
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { Label, LabelConsumer } from '../LabelContext/LabelContext';
import { EditorConsumer } from '../EditorContext/EditorContext';

const Behavior = ({ classes, target, lang, update }) => (
  <EditorConsumer>
    {configuration => {
      const config = configuration.behavior[target.type];
      return (
        <LabelConsumer>
          {labels => {
            if (config) {
              return (config.groups || []).map((group, index) => {
                // Radio
                if (Array.isArray(group)) {
                  if (group.length > 1) {
                    return (
                      <RadioGroup
                        aria-label={
                          labels[`${target.type}.behavior.label.${group.label}`] ||
                          labels[`Behavior.label.${group.label}`] ||
                          group.label
                        }
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
                            label={
                              labels[`${target.type}.behaviour.value.${value}`] ||
                              labels[`Behaviour.value.${value}`] ||
                              value
                            }
                            labelPlacement="end"
                          />
                        ))}
                      </RadioGroup>
                    );
                  } else {
                    //Checkbox
                    return (
                      <FormControlLabel
                        label={
                          labels[`${target.type}.behaviour.value.${group[0]}`] ||
                          labels[`Behaviour.value.${group[0]}`] ||
                          group[0]
                        }
                        labelPlacement="end"
                        control={
                          <Checkbox
                            color="primary"
                            checked={
                              (target.behavior || []).filter(val => val === group[0])
                                .length > 0
                            }
                            onChange={() => {
                              const behaviours = target.behavior || [];
                              if (behaviours.indexOf(group[0]) !== -1) {
                                update(
                                  target,
                                  'behavior',
                                  null,
                                  behaviours.filter(val => val !== group[0])
                                );
                              } else {
                                update(
                                  target,
                                  'behavior',
                                  null,
                                  [].concat(behaviours).concat(group[0])
                                );
                              }
                            }}
                            value={group[0]}
                          />
                        }
                      />
                    );
                  }
                } else if (typeof group === 'string') {
                  return (
                    <TextField
                      label="Freetext behavior"
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
                        aria-label={
                          labels[`${target.type}.behavior.label.` + group.label] ||
                          labels[`Behaviour.label.` + group.label] ||
                          group.label
                        }
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
                            label={
                              labels[`${target.type}.behavior.value.${value}`] ||
                              labels[`Behavior.value.${value}`] ||
                              value
                            }
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
                  return React.createElement(group.name, {
                    target,
                    update,
                  });
                }
              });
            } else {
              return (target.behavior || [])
                .concat([''])
                .map((behaviour, idx, arr) => (
                  <TextField
                    value={behaviour}
                    key={`${target.id}.behavior.${idx}`}
                    onChange={ev =>
                      update(target, `behavior.${idx}`, null, ev.target.value)
                    }
                    className={classes.textField}
                    margin="dense"
                    variant="outlined"
                    InputProps={{
                      endAdornment: arr.length - 1 !== idx && (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              update(
                                target,
                                'behavior',
                                null,
                                (target.behavior || []).filter(
                                  (el, index) => index !== idx
                                )
                              )
                            }
                          >
                            <Delete />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                ));
            }
          }}
        </LabelConsumer>
      )
    }}
  </EditorConsumer>
);

export default Behavior;
