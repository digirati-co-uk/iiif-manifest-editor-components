import * as React from 'react';
import {
  InputLabel,
  TextField,
  withStyles,
} from '@material-ui/core';
import { useState, useEffect } from 'react';
import CustomReactQuill from '../CustomReactQuill/CustomReactQuill';

const IS_HTML_REGEX = /<[^>]>/;

const style = theme => ({
  keyValuePair: {
    border: `1px solid ${theme.palette.action.disabled}`,
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    borderRadius: theme.shape.borderRadius,
  },
  keyValuePairFocus: {
    border: `2px solid ${theme.palette.primary.main}`,
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    borderRadius: theme.shape.borderRadius,
    transition: `border-color ${theme.transitions.duration.shorter} ${
      theme.transitions.easing.easeOut
    }, border-width ${theme.transitions.duration.shorter} ${
      theme.transitions.easing.easeOut
    }, padding-left ${theme.transitions.duration.shorter} ${
      theme.transitions.easing.easeOut
    }`,
  },
  keyValuePairContent: {
    marginTop: -theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
  },
  keyValuePairField: {
    '&>div>fieldset': {
      border: '0 none !important',
      '&>legend': {
        background: '#fff',
      },
    },
  },
  htmlSwitchWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginBottom: theme.spacing.unit,
  },
  htmlSwitch: Object.assign({}, theme.typography.overline, {
    position: 'absolute',
    top: 0,
    right: 0,
    fontWeight: 'bold',
    background: '#fff',
    color: theme.palette.primary.main,
    padding: '2px 8px 3px',
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    cursor: 'pointer',
    lineHeight: 1,
    outline: 0,
  }),
  htmlFieldWrapper: {
    borderTop: '1px solid #ccc',
    marginTop: theme.spacing.unit,
    position: 'relative',
  },
  htmlEditorInputLabel: {
    background: '#fff',
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit / 2,
    marginLeft: -theme.spacing.unit,
  },
});

const IIIFKeyValueField = ({ classes, keyProps, valueProps, ...props }) => {
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


export default withStyles(style)(IIIFKeyValueField);
