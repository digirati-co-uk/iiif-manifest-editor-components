import * as React from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  TextField,
  withStyles,
} from '@material-ui/core';
import * as ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './quill-extras.scss';

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

class IIIFTextField extends React.Component {
  constructor(props) {
    super(props);
    this.quillRef = React.createRef();
    this.state = {
      htmlFieldFocus: false,
      htmlEditor: false,
      promptLabel: '',
      promptVisible: false,
      promptValue: '',
      promptCallback: null,
    };
  }

  addImage = (image, callback) => {
    this.setState({
      promptLabel: 'Image url',
      promptVisible: true,
      promptValue: '',
      promptCallback: this.addAudioCallback,
      promptRange: this.quillRef.getEditor().getSelection(),
    });
  };

  addAudioCallback = () => {
    const value = this.state.promptValue;
    const range = this.state.promptRange;
    if (value) {
      this.quillRef
        .getEditor()
        .insertEmbed(range.index, 'image', value, 'user');
    }
  };

  addVideo = (video, callback) => {
    this.setState({
      promptLabel: 'Video url',
      promptVisible: true,
      promptValue: '',
      promptCallback: this.addVideoCallback,
      promptRange: this.quillRef.getEditor().getSelection(),
    });
  };

  addVideoCallback = () => {
    const value = this.state.promptValue;
    const range = this.state.promptRange;
    if (value) {
      value.match(
        /(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com)|dailymotion.com)\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/
      );
      let url = value;

      if (RegExp.$3.indexOf('youtu') > -1) {
        url = '//www.youtube.com/embed/' + RegExp.$6;
      } else if (RegExp.$3.indexOf('vimeo') > -1) {
        url = '//player.vimeo.com/video/' + RegExp.$6;
      } else if (RegExp.$3.indexOf('dailymotion.com') > -1) {
        url = '//www.dailymotion.com/embed/video/' + RegExp.$6;
      }
      this.quillRef.getEditor().insertEmbed(range.index, 'video', url, 'user');
    }
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    return (
      this.state.htmlFieldFocus !== nextState.htmlFieldFocus ||
      this.state.htmlEditor !== nextState.htmlEditor ||
      this.state.promptLabel !== nextState.promptLabel ||
      this.state.promptValue !== nextState.promptValue ||
      this.state.promptVisible !== nextState.promptVisible ||
      this.props.value !== nextProps.value ||
      this.props.label !== nextProps.label ||
      this.state.htmlEditor !== nextState.htmlEditor ||
      (!!nextProps.valueProps &&
        !!this.props.valueProps &&
        IS_HTML_REGEX.test(this.props.valueProps.value) !==
          IS_HTML_REGEX.test(nextProps.valueProps.value))
    );
  };

  cancelPrompt = () =>
    this.setState({
      promptLabel: '',
      promptVisible: false,
      promptValue: '',
      promptCallback: null,
    });

  setPromptValue = ev => {
    this.setState({
      promptValue: ev.target.value,
    });
  };

  applyPrompt = () => {
    if (this.state.promptCallback) {
      this.state.promptCallback();
    }
    this.setState({
      promptLabel: '',
      promptVisible: false,
      promptValue: '',
      promptCallback: null,
      promptRange: null,
    });
  };

  render() {
    const { classes, label, ...props } = this.props;
    const { htmlFieldFocus, htmlEditor } = this.state;
    const isHTML = IS_HTML_REGEX.test(props.value);
    // const [htmlFieldFocus, setHtmlFieldFocus] = useState(false);
    // const [htmlEditor, setHTMLEditor] = useState(isHTML);
    return (
      <div className={classes.htmlSwitchWrapper}>
        <FormControl component="fieldset">
          {!htmlEditor ? (
            <TextField
              label={label}
              {...props}
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
              <div style={{ position: 'relative' }}>
                <ReactQuill
                  value={props.value || ''}
                  ref={el => (this.quillRef = el)}
                  modules={{
                    toolbar: {
                      container: [
                        //[{ header: [1, 2, false] }],
                        ['bold', 'italic'],
                        ['link', 'blockquote', 'image', 'video'], //,
                        //[{ list: 'ordered' }, { list: 'bullet' }]
                      ],
                      handlers: {
                        image: this.addImage,
                        video: this.addVideo,
                      },
                    },
                  }}
                  onChange={changedValue =>
                    props.onChange({
                      target: {
                        value: changedValue,
                      },
                    })
                  }
                  onFocus={() =>
                    this.setState({
                      htmlFieldFocus: true,
                    })
                  }
                  onBlur={() =>
                    this.setState({
                      htmlFieldFocus: true,
                    })
                  }
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: this.state.promptVisible ? 'flex' : 'none',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      padding: '16px',
                      display: 'flex',
                      background: 'white',
                      alignItems: 'flex-end',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <TextField
                      style={{
                        flex: 1,
                      }}
                      label={this.state.promptLabel}
                      value={this.state.promptValue}
                      onChange={this.setPromptValue}
                    />
                    <Button onClick={this.cancelPrompt}>Cancel</Button>
                    <Button onClick={this.applyPrompt}>OK</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </FormControl>
        <button
          className={classes.htmlSwitch}
          onClick={() => {
            const htmlEditorVisible = !htmlEditor;
            this.setState({
              htmlEditor: htmlEditorVisible,
              htmlFieldFocus: !htmlEditorVisible
                ? false
                : this.state.htmlFieldFocus,
            });
          }}
        >
          {htmlEditor ? (isHTML ? 'SRC' : 'TXT') : 'HTML'}
        </button>
      </div>
    );
  }
}

export default withStyles(style)(IIIFTextField);
