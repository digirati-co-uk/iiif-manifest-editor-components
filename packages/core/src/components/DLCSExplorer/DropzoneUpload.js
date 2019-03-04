import * as React from 'react';
import Dropzone from 'react-dropzone';
import {
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@material-ui/core';
import { CheckCircle, Error, QuestionAnswerOutlined } from '@material-ui/icons';
import { guid } from '../../utils/URIGenerator';
import { EditorConsumer } from '../EditorContext/EditorContext';

const getKey = name =>
  'temporary/' +
  new Date().toISOString().replace(/T.*/, '') +
  '/' +
  encodeURIComponent(name);

const UPDATE_THROTTLING = 250;
const PART_SIZE = 10 * 1024 * 1024;
const PARALLEL_UPLOADS = 1;

class DLCSDropzoneUpload extends React.Component {
  state = {
    files: [],
    uploaded: {},
    uploading: {},
    errors: {},
    lastUpdate: {},
  };
  constructor(props) {
    super(props);
    if (!DLCSDropzoneUpload.s3) {
      if (
        props.configuration.s3.AMZN_S3_IDENTITY_POOL_HASH &&
        props.configuration.s3.AMZN_S3_REGION &&
        props.configuration.s3.AMZN_S3_BUCKET
      ) {
        const awsJS = document.createElement('script');
        awsJS.async = false;
        awsJS.src = 'https://sdk.amazonaws.com/js/aws-sdk-2.283.1.min.js';
        awsJS.onload = ev => {
          //var albumBucketName = props.configuration.s3.AMZN_S3_BUCKET;
          window.AWS.config.region = props.configuration.s3.AMZN_S3_REGION; // Region
          window.AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: `${props.configuration.s3.AMZN_S3_REGION}:${
              props.configuration.s3.AMZN_S3_IDENTITY_POOL_HASH
            }`,
          });
          DLCSDropzoneUpload.s3 = new AWS.S3({
            apiVersion: '2012-10-17',
            params: {
              Bucket: props.configuration.s3.AMZN_S3_BUCKET,
            },
          });
        };
        document.head.appendChild(awsJS);
      } else {
        console.warn(
          `AMZN_S3_IDENTITY_POOL_HASH, AMZN_S3_REGION, AMZN_S3_BUCKET hasn\'t been found in the env, so upload functionality disabled`
        );
      }
    }
  }

  onDrop = files => {
    this.bulkUpload({
      files,
    });
    this.setState({
      files,
    });
  };

  uploadError = (fileName, message) => {
    this.setState({
      errors: {
        ...this.state.uploading,
        [fileName]: message,
      },
    });
  };

  uploadProgress = (fileName, percent) => {
    this.setState({
      uploading: {
        ...this.state.uploading,
        [fileName]: percent,
      },
    });
  };

  uploadItemComplete = (fileName, data) => {
    this.setState({
      uploaded: {
        ...this.state.uploaded,
        [fileName]: data,
      },
    });
    this.putImage(data);
  };

  putImage = data => {
    const { url, session } = this.props;
    const headers = new Headers();
    headers.append('Authorization', 'Basic ' + session.auth);
    headers.append('Content-Type', 'application/json');
    const urlParts = url.split('/');
    const space = parseInt(urlParts[urlParts.length - 1] || 0, 10);
    return fetch(`${url}/images/${guid()}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(
        {
          '@context': 'https://api.dlc.services/contexts/Image.jsonld',
          '@type': 'Image',
          origin: data.Location,
          space: space,
          tags: [],
          roles: [],
        },
        null,
        2
      ),
    })
      .then(response => {
        if (!(response.status === 200 || response.status === 201)) {
          throw `${response.status} - ${response.statusText}`;
        }
        return response;
      })
      .then(response => response.json())
      .then(response => {
        console.log('putImage - doneish', response);
        //TODO: do something
      })
      .catch(err => alert(err));
  };

  uploadComplete = () => {
    //this.ingest();
  };

  onCancel = () => {
    this.setState({
      files: [],
    });
  };

  resetUploadState = () => {
    if (this.props.afterUpload) {
      this.props.afterUpload();
    }
    this.setState({
      files: [],
      uploaded: {},
      uploading: {},
      errors: {},
      lastUpdate: {},
    });
  };

  bulkUpload = ({ files }) => {
    const lastUpdate = {};
    const uploaded = [];
    files.forEach(file => {
      const key = getKey(file.name);
      const params = {
        Key: key,
        Body: file,
        ACL: 'public-read',
      };
      const options = {
        partSize: PART_SIZE,
        queueSize: PARALLEL_UPLOADS,
      };
      if (!DLCSDropzoneUpload.s3) {
        return;
      }
      DLCSDropzoneUpload.s3
        .upload(params, options)
        .on('httpUploadProgress', evt => {
          const percent = parseInt((evt.loaded * 100) / evt.total);
          const epoch = new Date().getTime();
          if (
            epoch - UPDATE_THROTTLING >= (lastUpdate[file.name] || 0) ||
            percent === 100
          ) {
            lastUpdate[file.name] = epoch;
            this.uploadProgress(file.name, percent);
          }
        })
        .send((err, data) => {
          if (err) {
            this.uploadError(file.name, err.message);
            return;
          }
          uploaded.push(file.name);
          this.uploadItemComplete(file.name, data);
          if (files.length === uploaded.length) {
            this.uploadComplete();
          }
        });
    });
  };

  render() {
    return (
      <React.Fragment>
        <div
          style={{
            margin: '0',
            padding: '0.5rem',
            position: 'relative',
            height: '48px',
          }}
        >
          <Dropzone
            onDrop={this.onDrop.bind(this)}
            onFileDialogCancel={this.onCancel.bind(this)}
            style={{
              border: '2px dashed grey',
              height: '2rem',
              overflowY: 'auto',
              width: '100%',
              borderRadius: '0.5rem',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            accept="image/*"
          >
            <Typography>Drop Images Here to Upload.</Typography>
          </Dropzone>
        </div>
        {this.state.files.length ? (
          <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="md"
            open={true}
            aria-labelledby="confirmation-dialog-title"
          >
            <DialogTitle>Uploading Media</DialogTitle>
            <DialogContent>
              <List>
                {this.state.files.map(f => (
                  <ListItem key={f.name}>
                    <ListItemIcon>
                      {this.state.uploaded.hasOwnProperty(f.name) ? (
                        <CheckCircle />
                      ) : this.state.errors.hasOwnProperty(f.name) ? (
                        <Error />
                      ) : this.state.uploading.hasOwnProperty(f.name) ? (
                        <CircularProgress
                          variant="determinate"
                          value={this.state.uploading[f.name]}
                        />
                      ) : (
                        <QuestionAnswerOutlined />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={f.name}
                      secondary={`${f.size} bytes`}
                    />
                  </ListItem>
                ))}
              </List>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.resetUploadState}
                disabled={
                  this.state.files.length === this.state.uploaded.length
                }
                color="primary"
              >
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        ) : (
          ''
        )}
      </React.Fragment>
    );
  }
}

const DropzoneUpload = props => (
  <EditorConsumer>
    {configuration => (
      <DLCSDropzoneUpload {...props} configuration={configuration} />
    )}
  </EditorConsumer>
);

export default DropzoneUpload;
