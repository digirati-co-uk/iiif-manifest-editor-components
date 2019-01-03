import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core';

class NewAnnotationDialog extends React.Component {
  state = {
    resource: {
      body: {
        type: 'none',
      },
    },
  };

  static getDerivedStateFromProps(nextProps, state) {
    if (
      nextProps.form &&
      nextProps.form.defaultBody.type !== state.resource.body.type
    ) {
      return {
        resource: {
          type: 'Annotation',
          body: JSON.parse(JSON.stringify(nextProps.form.defaultBody)),
        },
      };
    }
    return null;
  }

  update = (target, property, lang, value) => {
    //TODO: should be just a dispatch,
    const targetClone = JSON.parse(JSON.stringify(target));
    let currentLevel = targetClone;
    const keys = property.split('.');
    if (keys.length > 1) {
      if (lang !== null) {
        keys.forEach(key => {
          if (!currentLevel[key]) {
            if (key === 'metadata') {
              currentLevel[key] = [];
            } else {
              currentLevel[key] = {};
            }
          }
          currentLevel = currentLevel[key];
        });
        currentLevel[lang] = value.split('\n');
      } else {
        keys.forEach((key, index) => {
          if (index === keys.length - 1) {
            currentLevel[key] = value;
          } else {
            if (!currentLevel[key]) {
              if (key === 'metadata') {
                currentLevel[key] = [];
              } else {
                currentLevel[key] = {};
              }
            }
            currentLevel = currentLevel[key];
          }
        });
      }
    } else {
      if (lang === null) {
        if (['navDate', 'rights'].indexOf(property) !== -1) {
          targetClone[property] = value;
        } else {
          targetClone[property] = value.split('\n');
        }
      } else {
        if (!targetClone.hasOwnProperty(property)) {
          targetClone[property] = {};
        }
        currentLevel[property][lang] = value.split('\n');
      }
    }
    this.setState({
      resource: targetClone,
    });
  };

  createAnnotation = () => {};

  render() {
    const { open, handleClose, form } = this.props;
    const { resource } = this.state;
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        maxWidth="sm"
        fullWidth={true}
        aria-labelledby="new-annotation-dialog"
      >
        <DialogTitle id="new-annotation-dialog">
          Create new {this.state.resource.type}
        </DialogTitle>
        <DialogContent>
          {form &&
            typeof form.propertyEditor === 'function' &&
            React.createElement(form.propertyEditor, {
              update: this.update,
              target: resource,
            })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            dismiss
          </Button>
          <Button onClick={this.createAnnotation} color="primary">
            create
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

NewAnnotationDialog.propTypes = {
  /** is the dialog open*/
  open: PropTypes.bool,
  /** the close function passed from the hosting component */
  handleClose: PropTypes.func,
  /** the annotation property editor form */
  form: PropTypes.any,
};

NewAnnotationDialog.defaultProps = {
  open: false,
};

export default NewAnnotationDialog;
