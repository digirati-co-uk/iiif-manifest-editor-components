import * as React from 'react';
import {
  Button,
  TextField,
} from '@material-ui/core';
import * as ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './quill-extras.scss';

class CustomReactQuill extends React.Component {
  constructor (props) {
    super(props);
    this.quillRef = React.createRef();
    this.state = {
      promptLabel: '',
      promptVisible: false,
      promptValue: '',
      promptCallback: null,
      promptRange: null,
    };
  }
  
  addImage = (image, callback) => {
    this.setState({
      promptLabel: 'Image url',
      promptVisible: true,
      promptValue: '',
      promptCallback: this.addImageCallback,
      promptRange: this.quillRef.getEditor().getSelection(),
    });
  };

  addImageCallback = () => {
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
    const { value, onChange, ...props } = this.props;
    const { promptLabel, promptValue, promptVisible } = this.state;
    return (
      <div style={{ position: 'relative' }}>
        <ReactQuill
          value={value || ''}
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
            onChange({
              target: {
                value: changedValue,
              },
            })
          }
          {...props}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: promptVisible ? 'flex' : 'none',
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
              label={promptLabel}
              value={promptValue}
              onChange={this.setPromptValue}
            />
            <Button onClick={this.cancelPrompt}>Cancel</Button>
            <Button onClick={this.applyPrompt}>OK</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default CustomReactQuill;