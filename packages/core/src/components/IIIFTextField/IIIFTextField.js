import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  TextField,
  withStyles,
} from '@material-ui/core';
import CustomReactQuill from '../CustomReactQuill/CustomReactQuill';

const IS_HTML_REGEX = /<[^>]>/;

const style = theme => ({
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
    marginTop: theme.spacing.unit,
    position: 'relative',
    border: `1px solid ${theme.palette.grey[400]}`,
    borderRadius: theme.shape.borderRadius,
  },
  htmlFieldWrapperFocus: {
    marginTop: theme.spacing.unit,
    position: 'relative',
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
  },
  htmlEditorInputLabel: {
    background: '#fff',
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit / 2,
    marginLeft: -theme.spacing.unit,
  },
});


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
    setTimer(setTimeout(() => {
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

export default withStyles(style)(IIIFTextField);
