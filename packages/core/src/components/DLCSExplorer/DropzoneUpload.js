import React from 'react';
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
import { CheckCircle, Error } from '@material-ui/icons';
//import { refresh } from '../../actions/portal';
import { bulkUpload } from './amazonS3';

class DropzoneUpload extends React.Component {
  state = {
    files: [],
    uploaded: {},
    uploading: {},
    errors: {},
    lastUpdate: {},
  };

  onDrop = files => {
    bulkUpload({
      files,
      onError: this.uploadError,
      onProgress: this.uploadProgress,
      onItemComplete: this.uploadItemComplete,
      onComplete: this.uploadComplete,
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
    return fetch(`${url}/images`, {
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

  createIngestPayload = () => {
    const urlParts = this.props.url.split('/');
    const space = parseInt(urlParts[urlParts.length - 1] || 0, 10);
    console.log(this.props.url, urlParts, space);
    return {
      '@context': 'http://www.w3.org/ns/hydra/context.jsonld',
      '@id': this.props.url,
      '@type': 'Collection',
      total_items: Object.keys(this.state.uploaded).length,
      member: Object.entries(this.state.uploaded).map(([key, data], index) => ({
        '@context': 'https://api.dlc.services/contexts/Image.jsonld',
        '@type': 'Image',
        origin: data.Location,
        space: space,
      })),
    };
  };

  ingest = () => {
    const imagesToIngest = this.createIngestPayload();
    const { baseUrl, url, session } = this.props;
    // dispatch(postData(`${baseUrl}/queue`, imagesToIngest, url));
    const headers = new Headers();
    headers.append('Authorization', 'Basic ' + session.auth);
    headers.append('Content-Type', 'application/json');
    return fetch(`${baseUrl}/queue`, {
      method: 'POST',
      headers,
      body: JSON.stringify(imagesToIngest, null, 2),
    })
      .then(response => {
        if (!(response.status === 200 || response.status === 201)) {
          throw `${response.status} - ${response.statusText}`;
        }
        return response;
      })
      .then(response => response.json())
      .then(response => {
        console.log('postData - doneish', response);
        //TODO: do something
      })
      .catch(err => alert(err));
  };

  onCancel = () => {
    this.setState({
      files: [],
    });
  };

  resetUploadState = () => {
    //const { dispatch } = this.props;
    this.setState({
      files: [],
      uploaded: {},
      uploading: {},
      errors: {},
      lastUpdate: {},
    });
    //dispatch(refresh());
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
                        ' '
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
              <Button onClick={this.resetUploadState} color="primary">
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

export default DropzoneUpload;
