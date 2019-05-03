import * as React from 'react';
import * as PropTypes from 'prop-types';
import {
  Button,
} from '@material-ui/core';

import { EditorConsumer } from '../EditorContext/EditorContext';
import { update, updateWithMeta } from '../../utils/IIIFResource';
import { SIZING_STRATEGY } from '../../constants/sizing';
import { Label } from '../LabelContext/LabelContext';
import ManifestEditorDialog from '../ManifestEditorDialog/ManifestEditorDialog'

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

  renderButton = (formName, {name, label, onClick}) => (
    <Button onClick={onClick} color="primary">
      <Label
        names={[
          `${formName}.NewAnnotationForm.${name}`,
          `NewAnnotationForm.${name}`,
        ]}
      >
        {label}
      </Label>
    </Button>
  )

  buttons = {
    dismiss: {
      name: 'dismiss',
      label: 'dismiss',
      onClick: this.props.handleClose,
    },
    fitContentToCanvas: {
      name: 'fitCanvasToContent',
      label: 'FIT CONTENT TO CANVAS',
      onClick: this.createAnnotation(
        SIZING_STRATEGY.SCALE_ANNOTATION_TO_CANVAS
      )
    },
    fitCanvasToContent: {
      name: 'fitCanvasToContent',
      label: 'FIT CANVAS TO CONTENT',
      onClick: this.createAnnotation(
        SIZING_STRATEGY.SCALE_CANVAS_TO_ANNOTATION
      )
    },
    add: {
      name: 'add',
      label: 'Add',
      onClick: this.createAnnotation(SIZING_STRATEGY.NONE)
    }
  }

  renderActions = () => {
    const { handleClose, form } = this.props;
    const formName = form ? form.formName : 'noform';
    return (
      <EditorConsumer>
        {configuration =>
          (
            configuration.annotationFormButtons[
              formName + '.NewAnnotationForm'
            ] || configuration.annotationFormButtons.NewAnnotationForm
          )
            .filter(button => button !== 'dismiss')
            .map(button => this.renderButton(formName, this.buttons[button]))
        }
      </EditorConsumer>
    )
  }

  render() {
    const { handleClose, form } = this.props;
    const { resource } = this.state;
    const resourceType = resource.type;
    return (
      <ManifestEditorDialog
        open={!!form}
        handleClose={handleClose}
        title={`Create new ${resourceType}`}
        actions={this.renderActions()}
        fullWidth={true}
        maxWidth="sm"
        closeLabel="Dismiss"
      >
        {form &&
          typeof form.propertyEditor === 'function' &&
          React.createElement(form.propertyEditor, {
            update: this.update,
            target: resource,
          })}
      </ManifestEditorDialog>
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
