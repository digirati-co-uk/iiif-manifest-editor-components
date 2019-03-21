import * as React from 'react';
import * as PropTypes from 'prop-types';
import {
  withStyles,
  TextField,
  FormControl,
  FormLabel,
} from '@material-ui/core';
import { locale, update as rawUpdate } from '../../utils/IIIFResource';
import { throttle } from 'throttle-debounce';
import { Label, LabelConsumer } from '../LabelContext/LabelContext';
import IIIFTextField from '../IIIFTextField/IIIFTextField';
import IIIFKeyValueField from '../IIIFKeyValueField/IIIFKeyValueField';
import IIIFBehaviours from '../IIIFBehaviours/IIIFBehaviours';

const styles = theme => ({
  label: {
    backgorund: '#fff',
  },
});

class MetadataEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      target: JSON.parse(JSON.stringify(props.target)),
      lastUpdate: new Date().getTime(),
    };
    this.throttledSyncProps = throttle(1000, false, this.syncLocalState);
  }

  static getDerivedStateFromProps(props, state) {
    const currentTime = new Date().getTime();
    if (
      props.target &&
      state.target.id &&
      props.target.id !== state.target.id
    ) {
      const internalRepr = JSON.parse(JSON.stringify(props.target));
      if (internalRepr.items) {
        delete internalRepr.items;
      }
      return {
        // Since this method fires on both props and state changes, local updates
        // to the controlled value will be ignored, because the props version
        // always overrides it. Oops!
        target: internalRepr,
        lastUpdate: currentTime,
      };
    }
    return null;
  }

  localUpdate = (target, prop, lang, val) => {
    const updated = rawUpdate(target, prop, lang, val);
    this.setState(
      {
        target: updated,
      },
      this.throttledSyncProps
    );
  };

  syncLocalState = () => {
    const currentTime = new Date().getTime();
    this.props.update(this.props.target, null, null, this.state.target);
    this.setState({
      lastUpdate: currentTime,
    });
  };

  render() {
    const {
      behaviorConfig,
      classes,
      target,
      lang,
      update,
      fieldConfig,
    } = this.props;
    const { type } = target || { type: '' };
    return (
      <LabelConsumer>
        {labels => (
          <React.Fragment>
            {fieldConfig.map(keyName => {
              if (typeof keyName === 'string') {
                switch (keyName) {
                  case 'label':
                    return (
                      <TextField
                        label={labels[type + '.Label'] || 'Label'}
                        key={`${target.id}_porperty_${keyName}`}
                        value={locale(this.state.target.label, lang)}
                        onChange={ev =>
                          this.localUpdate(
                            this.state.target,
                            'label',
                            lang,
                            ev.target.value
                          )
                        }
                        className={classes.textField}
                        margin="dense"
                        variant="outlined"
                      />
                    );
                  case 'summary':
                    return (
                      <IIIFTextField
                        key={`${target.id}_porperty_${keyName}`}
                        label={labels[type + '.Summary'] || 'Summary'}
                        value={locale(this.state.target.summary, lang)}
                        onChange={ev =>
                          this.localUpdate(
                            this.state.target,
                            'summary',
                            lang,
                            ev.target.value
                          )
                        }
                        className={classes.textField}
                      />
                    );
                  case 'requiredStatement':
                    return (
                      <FormControl
                        key={`${target.id}_porperty_${keyName}`}
                        component="fieldset"
                      >
                        <FormLabel component="legend">
                          {labels[type + '.RequiredStatement'] ||
                            'Required Statement'}
                        </FormLabel>
                        <IIIFKeyValueField
                          keyProps={{
                            label:
                              labels[type + '.RequiredStatement.Label'] ||
                              'Label',
                            value: locale(
                              this.state.target.requiredStatement &&
                                this.state.target.requiredStatement.label,
                              lang
                            ),
                            onChange: ev =>
                              this.localUpdate(
                                this.state.target,
                                'requiredStatement.label',
                                lang,
                                ev.target.value
                              ),
                          }}
                          valueProps={{
                            label:
                              labels[
                                type + 'Metadata.RequiredStatement.Value'
                              ] || 'Value',
                            value: locale(
                              this.state.target.requiredStatement &&
                                this.state.target.requiredStatement.value,
                              lang
                            ),
                            onChange: ev =>
                              this.localUpdate(
                                this.state.target,
                                'requiredStatement.value',
                                lang,
                                ev.target.value
                              ),
                          }}
                        />
                      </FormControl>
                    );
                  case 'metadata':
                    return (
                      <FormControl
                        key={`${target.id}_porperty_${keyName}`}
                        component="fieldset"
                      >
                        <FormLabel component="legend">
                          {labels[type + '.Metadata'] || 'Metadata'}
                        </FormLabel>
                        {(this.state.target.metadata || [])
                          .concat({
                            label: {
                              [lang]: '',
                            },
                            value: {
                              [lang]: '',
                            },
                          })
                          .map((metadata, index) => (
                            <IIIFKeyValueField
                              key={`metadata_row__${index}`}
                              keyProps={{
                                label:
                                  labels[type + '.Metadata.Label'] || 'Label',
                                value: locale(metadata.label, lang),
                                onChange: ev =>
                                  this.localUpdate(
                                    this.state.target,
                                    `metadata.${index}.label`,
                                    lang,
                                    ev.target.value
                                  ),
                              }}
                              valueProps={{
                                label:
                                  labels[type + '.Metadata.Value'] || 'Value',
                                value: locale(metadata.value, lang),
                                onChange: ev =>
                                  this.localUpdate(
                                    this.state.target,
                                    `metadata.${index}.value`,
                                    lang,
                                    ev.target.value
                                  ),
                              }}
                            />
                          ))}
                      </FormControl>
                    );
                  case 'navDate':
                    return (
                      <TextField
                        key={`${target.id}_porperty_${keyName}`}
                        label={labels[`${type}.NavDate`] || 'Nav Date'}
                        type="datetime-local"
                        className={classes.textField}
                        value={this.state.target.navDate || ''}
                        onChange={ev =>
                          this.localUpdate(
                            this.state.target,
                            'navDate',
                            null,
                            ev.target.value
                          )
                        }
                        margin="dense"
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    );
                  case 'rights':
                    return (
                      <TextField
                        key={`${target.id}_porperty_${keyName}`}
                        label={labels[`${type}.Rights`] || 'Rights'}
                        className={classes.textField}
                        value={this.state.target.rights || ''}
                        onChange={ev =>
                          this.localUpdate(
                            this.state.target,
                            'rights',
                            null,
                            ev.target.value
                          )
                        }
                        margin="dense"
                        variant="outlined"
                      />
                    );
                  case 'behavior':
                    return (
                      <FormControl
                        key={`${target.id}_porperty_${keyName}`}
                        component="fieldset"
                      >
                        <FormLabel component="legend">
                          {labels[`${type}.Behaviors`] || 'Behaviors'}
                        </FormLabel>
                        <IIIFBehaviours
                          config={behaviorConfig}
                          classes={classes}
                          target={target}
                          lang={lang}
                          update={update}
                        />
                      </FormControl>
                    );
                  default:
                    const _keyName = keyName.startsWith('_')
                      ? keyName.substr(1)
                      : keyName;
                    return (
                      <TextField
                        label={
                          labels[`${type}.${_keyName}`] ||
                          labels[_keyName] ||
                          _keyName
                        }
                        key={`${target.id}_porperty_${_keyName}`}
                        className={classes.textField}
                        value={this.state.target[_keyName] || ''}
                        onChange={ev =>
                          this.localUpdate(
                            this.state.target,
                            _keyName,
                            keyName.startsWith('_') ? lang : null,
                            ev.target.value
                          )
                        }
                        margin="dense"
                        variant="outlined"
                      />
                    );
                }
              }
            })}
          </React.Fragment>
        )}
      </LabelConsumer>
    );
  }
}

MetadataEditor.propTypes = {
  target: PropTypes.any,
  /** Language */
  lang: PropTypes.string,
  update: PropTypes.func,
  behaviorConfig: PropTypes.object,
  fieldConfig: PropTypes.array,
};

MetadataEditor.defaultProps = {
  lang: 'en',
  update: () => () => {},
  fieldConfig: null,
};

export default withStyles(styles)(MetadataEditor);
