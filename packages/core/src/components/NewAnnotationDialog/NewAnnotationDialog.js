import * as React from 'react';
import * as PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core';

import { EditorConsumer } from '../EditorContext/EditorContext';
import { update, updateWithMeta } from '../../utils/IIIFResource';
import { SIZING_STRATEGY } from '../../constants/sizing';
import { Label } from '../LabelContext/LabelContext';

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
    // updateWithMetaB(target, property, lang, value).then(
    //   ({ result, prop, lan, val }) =>
    //     this.setState({
    //       resource: update(result, prop, lan, val),
    //     })
    // );
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
      //TODO: make this configurable...
      this.setState({
        resource: {
          body: {
            type: 'none',
          },
        },
      });
    }
  };

  render() {
    const { handleClose, form } = this.props;
    const { resource } = this.state;
    const resourceType = resource.type;
    const formName = form ? form.name : 'noform';
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
          Create new {resourceType}
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
          <EditorConsumer>
            {configuration =>
              (
                configuration.annotationFormButtons[
                  formName + '.NewAnnotationForm'
                ] || configuration.annotationFormButtons.NewAnnotationForm
              ).map(button => (
                <React.Fragment>
                  {button === 'dismiss' && (
                    <Button onClick={handleClose} color="primary">
                      <Label
                        names={[
                          `${formName}.NewAnnotationForm.dismiss`,
                          'NewAnnotationForm.dismiss',
                        ]}
                      >
                        dismiss
                      </Label>
                    </Button>
                  )}
                  {button === 'fitContentToCanvas' && (
                    <Button
                      onClick={this.createAnnotation(
                        SIZING_STRATEGY.SCALE_ANNOTATION_TO_CANVAS
                      )}
                      color="primary"
                    >
                      <Label
                        names={[
                          `${formName}.NewAnnotationForm.fitContentToCanvas`,
                          'NewAnnotationForm.fitContentToCanvas',
                        ]}
                      >
                        FIT CONTENT TO CANVAS
                      </Label>
                    </Button>
                  )}
                  {button === 'fitCanvasToContent' && (
                    <Button
                      onClick={this.createAnnotation(
                        SIZING_STRATEGY.SCALE_CANVAS_TO_ANNOTATION
                      )}
                      color="primary"
                    >
                      <Label
                        names={[
                          `${formName}.NewAnnotationForm.fitCanvasToContent`,
                          'NewAnnotationForm.fitCanvasToContent',
                        ]}
                      >
                        FIT CANVAS TO CONTENT
                      </Label>
                    </Button>
                  )}
                  {button === 'add' && (
                    <Button
                      onClick={this.createAnnotation(SIZING_STRATEGY.NONE)}
                      color="primary"
                    >
                      <Label
                        names={[
                          `${formName}.NewAnnotationForm.add`,
                          'NewAnnotationForm.add',
                        ]}
                      >
                        Add
                      </Label>
                    </Button>
                  )}
                </React.Fragment>
              ))
            }
          </EditorConsumer>
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
