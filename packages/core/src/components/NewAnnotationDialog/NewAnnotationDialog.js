import * as React from 'react';
import * as PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core';

import { update, updateWithMeta } from '../../utils/IIIFResource';
import { SIZING_STRATEGY } from '../../constants/sizing';

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
    updateWithMeta(target, property, lang, value, (result, prop, lng, val) => {
      this.setState({
        resource: update(result, prop, lng, val),
      });
    });
  };

  createAnnotation = sizingStrategy => () => {
    const { addNewResource } = this.props;
    if (addNewResource) {
      addNewResource(this.state.resource, sizingStrategy);
    }
  };

  render() {
    const { handleClose, form } = this.props;
    const { resource } = this.state;
    return (
      <Dialog
        open={!!form}
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
          <Button
            onClick={this.createAnnotation(
              SIZING_STRATEGY.SCALE_ANNOTATION_TO_CANVAS
            )}
            color="primary"
          >
            Squeeze annotation into canvas
          </Button>
          <Button
            onClick={this.createAnnotation(
              SIZING_STRATEGY.SCALE_CANVAS_TO_ANNOTATION
            )}
            color="primary"
          >
            Extend canvas to fit annotation
          </Button>
          <Button
            onClick={this.createAnnotation(SIZING_STRATEGY.NONE)}
            color="primary"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

NewAnnotationDialog.propTypes = {
  /** the close function passed from the hosting component */
  handleClose: PropTypes.func,
  /** the annotation property editor form */
  form: PropTypes.any,
  /** create new annotation */
  addNewResource: PropTypes.func,
};

NewAnnotationDialog.defaultProps = {};

export default NewAnnotationDialog;
