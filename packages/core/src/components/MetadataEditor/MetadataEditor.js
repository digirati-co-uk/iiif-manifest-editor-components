import * as React from 'react';
import * as PropTypes from 'prop-types';
import {
  withStyles,
  FormControl,
  FormLabel,
} from '@material-ui/core';

import { locale } from '../../utils/IIIFResource';
import { LabelConsumer } from '../LabelContext/LabelContext';
import IIIFTextField from '../fields/IIIFTextField/IIIFTextField';
import IIIFKeyValueField from '../fields/IIIFKeyValueField/IIIFKeyValueField';
import IIIFBehaviours from '../IIIFBehaviours/IIIFBehaviours';
import IIIFInputField from '../fields/IIIFInputField/IIIFInputField';

const styles = theme => ({
  label: {
    backgorund: '#fff',
  },
});

const MetadataEditor = ({
  behaviorConfig,
  classes,
  target,
  lang,
  update,
  fieldConfig,
}) => {
  const { type } = target || { type: '' };
  const targetEntity = target;
  return (
    <LabelConsumer>
      {labels => (
        <React.Fragment>
          {fieldConfig.map(keyName => {
            if (typeof keyName === 'string') {
              switch (keyName) {
                case 'label':
                  return (
                    <IIIFInputField
                      label={labels[type + '.Label'] || 'Label'}
                      key={`${target.id}_property_${keyName}:${lang}_input`}
                      value={locale(targetEntity.label, lang)}
                      onChange={ev =>
                        update(
                          targetEntity,
                          'label',
                          lang,
                          ev.target.value
                        )
                      }
                      className={classes.textField}
                    />
                  );
                case 'summary':
                  return (
                    <IIIFTextField
                      key={`${target.id}_property_${keyName}:${lang}_input`}
                      label={labels[type + '.Summary'] || 'Summary'}
                      value={locale(targetEntity.summary, lang)}
                      onChange={ev =>
                        update(
                          targetEntity,
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
                      key={`${target.id}_property_${keyName}:${lang}`}
                      component="fieldset"
                    >
                      <FormLabel component="legend">
                        {labels[type + '.RequiredStatement'] ||
                          'Required Statement'}
                      </FormLabel>
                      <IIIFKeyValueField
                        key={`${target.id}_property_${keyName}:${lang}_input`}
                        keyProps={{
                          label:
                            labels[type + '.RequiredStatement.Label'] ||
                            'Label',
                          value: locale(
                            targetEntity.requiredStatement &&
                              targetEntity.requiredStatement.label,
                            lang
                          ),
                          onChange: ev => update(
                            targetEntity,
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
                            targetEntity.requiredStatement &&
                              targetEntity.requiredStatement.value,
                            lang
                          ),
                          onChange: ev => update(
                            targetEntity,
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
                      key={`${target.id}_property_${keyName}:${lang}`}
                      component="fieldset"
                    >
                      <FormLabel component="legend">
                        {labels[type + '.Metadata'] || 'Metadata'}
                      </FormLabel>
                      {(targetEntity.metadata || [])
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
                            key={`${target.id}_metadata_row__${index}:${lang}_input`}
                            keyProps={{
                              label:
                                labels[type + '.Metadata.Label'] || 'Label',
                              value: locale(metadata.label, lang),
                              onChange: ev => update(
                                  targetEntity,
                                  `metadata.${index}.label`,
                                  lang,
                                  ev.target.value
                                ),
                            }}
                            valueProps={{
                              label:
                                labels[type + '.Metadata.Value'] || 'Value',
                              value: locale(metadata.value, lang),
                              onChange: ev => update(
                                  targetEntity,
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
                    <IIIFInputField
                      key={`${target.id}_property_${keyName}`}
                      label={labels[`${type}.NavDate`] || 'Nav Date'}
                      type="datetime-local"
                      className={classes.textField}
                      value={targetEntity.navDate || ''}
                      onChange={ev => update(
                        targetEntity,
                        'navDate',
                        null,
                        ev.target.value
                      )}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  );
                case 'rights':
                  return (
                    <IIIFInputField
                      key={`${target.id}_property_${keyName}`}
                      label={labels[`${type}.Rights`] || 'Rights'}
                      className={classes.textField}
                      value={targetEntity.rights || ''}
                      onChange={ev => update(
                        targetEntity,
                        'rights',
                        null,
                        ev.target.value
                      )}
                    />
                  );
                case 'behavior':
                  return (
                    <FormControl
                      key={`${target.id}_property_${keyName}`}
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
                    <IIIFInputField
                      label={
                        labels[`${type}.${_keyName}`] ||
                        labels[_keyName] ||
                        _keyName
                      }
                      key={`${target.id}_property_${_keyName}${keyName.startsWith('_') ? ':' + lang : ''}`}
                      className={classes.textField}
                      value={targetEntity[_keyName] || ''}
                      onChange={ev => update(
                        targetEntity,
                        _keyName,
                        keyName.startsWith('_') ? lang : null,
                        ev.target.value
                      )}
                    />
                  );
              }
            }
          })}
        </React.Fragment>
      )}
    </LabelConsumer>
  );
};


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
