import * as React from 'react';
import { useState } from 'react';
import {
  FormControl,
  InputLabel,
  TextField,
  withStyles,
} from '@material-ui/core';
import * as ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
//import './quill-extras.scss';

const Quill = ReactQuill.Quill;
const BlockEmbed = Quill.import('blots/block/embed');

// class ImageBlot extends BlockEmbed {
//   static create(value) {
//     const node = super.create();
//     node.setAttribute('alt', value.alt);
//     node.setAttribute('src', value.url);
//     return node;
//   }

//   static value(node) {
//     return {
//       alt: node.getAttribute('alt'),
//       url: node.getAttribute('src'),
//     };
//   }
// }
// ImageBlot.blotName = 'image';
// ImageBlot.tagName = 'img';
// ImageBlot.className = 'inline-img';
// Quill.register(ImageBlot);

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
  const [fieldFocus, setFieldFocus] = useState(false);
  const isHTML = IS_HTML_REGEX.test(valueProps.value);
  const [htmlFieldFocus, setHtmlFieldFocus] = useState(false);
  const [htmlEditor, setHTMLEditor] = useState(isHTML);
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
            onFocus={ev => setFieldFocus(true)}
            onBlur={ev => setFieldFocus(false)}
            className={classes.keyValuePairField}
            margin="dense"
            variant="outlined"
          />
          {!htmlEditor ? (
            <TextField
              {...valueProps}
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
              <div>
                <ReactQuill
                  value={valueProps.value || ''}
                  modules={{
                    toolbar: [
                      //[{ header: [1, 2, false] }],
                      ['bold', 'italic'],
                      ['link', 'blockquote', 'image', 'video'], //,
                      //[{ list: 'ordered' }, { list: 'bullet' }]
                    ],
                    // handlers: {
                    //   'image': (image, callback) => {
                    //     var range = this.quillRef.getEditor().getSelection();
                    //     var value = prompt('What is the image URL');
                    //       if(value) {
                    //         this.quillRef.getEditor().insertEmbed(range.index, 'image', value, "user");
                    //       }
                    //   }
                    // }
                  }}
                  onChange={changedValue =>
                    valueProps.onChange &&
                    valueProps.onChange({
                      target: {
                        value: changedValue,
                      },
                    })
                  }
                  onFocus={() => {
                    setFieldFocus(true);
                    setHtmlFieldFocus(true);
                  }}
                  onBlur={() => {
                    setHtmlFieldFocus(false);
                    setFieldFocus(false);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <button
        className={classes.htmlSwitch}
        onClick={() => {
          const htmlEditorVisible = !htmlEditor;
          setHTMLEditor(htmlEditorVisible);
          if (!htmlEditorVisible) {
            setHtmlFieldFocus(false);
          }
        }}
      >
        {htmlEditor ? (isHTML ? 'SRC' : 'TXT') : 'HTML'}
      </button>
    </div>
  );
};

export default withStyles(style)(IIIFKeyValueField);
