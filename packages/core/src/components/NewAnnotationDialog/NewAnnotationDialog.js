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

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.form &&
      nextProps.form.defaultBody !== prevState.resource.type
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

  update = (target, value) => {
    // this.setState({
    //   resource:
    // });
  };

  createAnnotation = () => {};

  render() {
    const { open, handleClose, form } = this.props;
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        maxWidth="md"
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
              target: this.state.resource,
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
