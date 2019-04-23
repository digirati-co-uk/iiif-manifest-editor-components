import * as React from 'react';
import * as PropTypes from 'prop-types';
import {
  InputLabel,
  TextField,
  withStyles,
} from '@material-ui/core';
import { useState, useEffect } from 'react';
import CustomReactQuill from '../CustomReactQuill/CustomReactQuill';
import style from './IIIFKeyValueField.style';

const IS_HTML_REGEX = /<[^>]>/;

const IIIFKeyValueField = ({ classes, keyProps, valueProps }) => {
  const isHTML = IS_HTML_REGEX.test(valueProps.value);
  const [fieldFocus, setFieldFocus] = useState(false);
  const [htmlFieldFocus, setHtmlFieldFocus] = useState(false);
  const [htmlEditor, setHTMLEditor] = useState(isHTML);

  const [internalKey, setInternalKey] = useState(keyProps.value);
  const [internalValue, setInternalValue] = useState(valueProps.value);
  const [keyTimer, setKeyTimer] = useState();
  const [valueTimer, setValueTimer] = useState();

  useEffect(() => {
    if (keyTimer) {
      clearTimeout(keyTimer);
    }
    setKeyTimer(setTimeout(() => {
      internalKey !== '' && internalValue !== '' &&
      keyProps.onChange && 
      keyProps.onChange({
        target: {
          value: internalKey
        }
      });
    }, 1000));
  }, [internalKey]);

  useEffect(() => {
    if (valueTimer) {
      clearTimeout(valueTimer);
    }
    setValueTimer(setTimeout(() => {
      internalKey !== '' && internalValue !== '' &&
      valueProps.onChange && 
      valueProps.onChange({
        target: {
          value: internalValue
        }
      });
    }, 1000));
  }, [internalValue]);
  
  const handleOnChangeKey = e => setInternalKey(e.target.value);
  const handleOnChangeValue = e => setInternalValue(e.target.value);

  return (
    <div className={classes.htmlSwitchWrapper}>
      <div
        className={
          fieldFocus ? classes.keyValuePairFocus : classes.keyValuePair
        }
      >
        <div className={classes.keyValuePairContent}>
          <TextField
            {...keyProps}
            value={internalKey || keyProps.value || ''}
            onChange={handleOnChangeKey}
            onFocus={ev => setFieldFocus(true)}
            onBlur={ev => setFieldFocus(false)}
            className={classes.keyValuePairField}
            margin="dense"
            variant="outlined"
          />
          {!htmlEditor ? (
            <TextField
              {...valueProps}
              value={internalValue || valueProps.value || ''}
              onChange={handleOnChangeValue}
              onFocus={ev => setFieldFocus(true)}
              onBlur={ev => setFieldFocus(false)}
              className={classes.keyValuePairField}
              margin="dense"
              variant="outlined"
              multiline
            />
          ) : (
            <div className={classes.htmlFieldWrapper}>
              <InputLabel
                component="legend"
                filled={true}
                shrink={true}
                margin="dense"
                variant="outlined"
                focused={htmlFieldFocus}
                className={classes.htmlEditorInputLabel}
              >
                {valueProps.label}
              </InputLabel>
              <CustomReactQuill 
                value={internalValue || valueProps.value || ''}
                onChange={handleOnChangeValue}
                onFocus={() => {
                  setFieldFocus(true);
                  setHtmlFieldFocus(true);
                }}
                onBlur={() => {
                  setFieldFocus(true);
                  setHtmlFieldFocus(true);
                }}
              />
            </div>
          )}
        </div>
      </div>
      <button
        className={classes.htmlSwitch}
        onClick={() => {
          const htmlEditorVisible = !htmlEditor;
          setHTMLEditor(htmlEditorVisible);
          setHtmlFieldFocus(
            !htmlEditorVisible
              ? false
              : this.state.htmlFieldFocus
          );
        }}
      >
        {htmlEditor ? (isHTML ? 'SRC' : 'TXT') : 'HTML'}
      </button>
    </div>
  );
};

IIIFKeyValueField.propTypes = {
  /** style classes */
  classes: PropTypes.object.isRequired,
  /** key field properties */
  keyProps: PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    onChange: PropTypes.func,
  }),
  /** value field properties */
  valueProps: PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    onChange: PropTypes.func,
  })
};

export default withStyles(style)(IIIFKeyValueField);
