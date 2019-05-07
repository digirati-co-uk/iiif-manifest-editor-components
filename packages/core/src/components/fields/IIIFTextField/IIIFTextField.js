import * as React from 'react';
import * as PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  TextField,
  withStyles,
} from '@material-ui/core';
import CustomReactQuill from '../CustomReactQuill/CustomReactQuill';
import style from './IIIFTextField.style';

const IS_HTML_REGEX = /<[^>]+>/g;

const IIIFTextField = ({ classes, label, ...props }) => {
  const isHTML = IS_HTML_REGEX.test(props.value);
  const [htmlFieldFocus, setHtmlFieldFocus] = useState(false);
  const [htmlEditor, setHTMLEditor] = useState(isHTML);
  const [internalValue, setInternalValue] = useState(props.value);
  const [timer, setTimer] = useState();

  useEffect(() => {
    if (timer) {
      clearTimeout(timer);
    }
    if (props.value === internalValue) {
      return;
    }
    setTimer(setTimeout(() => {
      console.log('IIIFTextField->timer', props.value, internalValue);
      props.onChange({
        target: {
          value: internalValue
        }
      });
    }, 1000));
  }, [internalValue]);

  const handleOnChange = e => setInternalValue(e.target.value);
  
  return (
    <div className={classes.htmlSwitchWrapper}>
      <FormControl component="fieldset">
        {!htmlEditor ? (
          <TextField
            label={label}
            {...props}
            value={internalValue || props.value}
            onChange={handleOnChange}
            margin="dense"
            variant="outlined"
            multiline
          />
        ) : (
          <div
            className={
              htmlFieldFocus
                ? classes.htmlFieldWrapperFocus
                : classes.htmlFieldWrapper
            }
          >
            <InputLabel
              component="legend"
              filled={true}
              shrink={true}
              margin="dense"
              variant="outlined"
              focused={htmlFieldFocus}
              className={classes.htmlEditorInputLabel}
            >
              {label}
            </InputLabel>
            <CustomReactQuill 
              value={internalValue || props.value}
              onChange={handleOnChange}
              onFocus={() => setHtmlFieldFocus(true)}
              onBlur={() => setHtmlFieldFocus(false)}                
            />
          </div>
        )}
      </FormControl>
      <button
        className={classes.htmlSwitch}
        onClick={() => {
          const htmlEditorVisible = !htmlEditor;
          setHTMLEditor(
            htmlEditorVisible
          );
          setHtmlFieldFocus(
            !htmlEditorVisible
              ? false
              : htmlFieldFocus
          )
        }}
      >
        {htmlEditor ? (isHTML ? 'SRC' : 'TXT') : 'HTML'}
      </button>
    </div>
  );
};

IIIFTextField.propTypes = {
  /** style classes */
  classes: PropTypes.object.isRequired,
  /** field label */
  label: PropTypes.string,
};

export default withStyles(style)(IIIFTextField);
