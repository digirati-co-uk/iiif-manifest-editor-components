import * as React from 'react';
import * as PropTypes from 'prop-types';
import {
  InputLabel,
  withStyles,
} from '@material-ui/core';
import { Translate } from '@material-ui/icons';

import { EditorConsumer } from '../EditorContext/EditorContext';
import MetadataEditor from '../MetadataEditor/MetadataEditor';
import LanguagesDropdown from '../LanguagesDropdown/LanguagesDropdown';
import ButtonWithTooltip from '../ButtonWithTooltip/ButtonWithTooltip';
import TranslationDialog from './Properties.TranslationDialog';
import { updateWithMeta } from '../../utils/IIIFResource';

import SimplePanel from './Properties.SimplePanel';
import AccordionPanel from './Properties.AccordionPanel';
import style from './Properties.styles';

class Properties extends React.Component {
  state = {
    mirrorTranslationOpen: false,
  };

  openTranslations = () => {
    this.setState({
      mirrorTranslationOpen: true,
    });
  };

  closeTranslations = () => {
    this.setState({
      mirrorTranslationOpen: false,
    });
  };

  update = (target, property, lang, value) => {
    updateWithMeta(target, property, lang, value, (result, prop, lng, val) => {
      this.props.update(result, prop, lng, val);
    });
    // updateWithMetaB(target, property, lang, value).then(
    //   ({ result, prop, lan, val }) => this.props.update(result, prop, lan, val)
    // );
  };

  renderTranslationHeader = () => {
    const {
      classes,
      lang,
      changeLanguage,
      noTranslation,
    } = this.props;
    return !noTranslation && (
      <div className={classes.translationBar}>
        <ButtonWithTooltip
          title="Launch mirror translation tool"
          onClick={this.openTranslations}
        >
          <Translate />
        </ButtonWithTooltip>
        <InputLabel className={classes.currentLanguageLabel}>
          Current Language
        </InputLabel>
        <LanguagesDropdown changeLanguage={changeLanguage} lang={lang} />
      </div>
    );
  };

  renderAnnotationEditor = (configuration) => {
    const annotationType = this.getAnnotationType();
    const form = configuration.annotation[annotationType];
    const { annotation, lang, update } = this.props;
    return (
      <React.Fragment>
        <MetadataEditor
          target={annotation}
          lang={lang}
          update={update}
          behaviorConfig={
            configuration.behavior.Annotation
          }
          fieldConfig={
            configuration.propertyFields.Annotation
          }
        />
        {annotationType}
        {form &&
          typeof form.propertyEditor === 'function' &&
          React.createElement(form.propertyEditor, {
            update: this.update,
            target: annotation,
          })}
      </React.Fragment>
    )
  };

  renderCanvasEditor = (configuration) => {
    const { canvas, lang, update } = this.props;
    return (
      <MetadataEditor
        target={canvas}
        lang={lang}
        update={update}
        behaviorConfig={configuration.behavior.Canvas}
        fieldConfig={
          configuration.propertyFields.Canvas
        }
      />
    );
  };

  renderManifestEditor = (configuration) => {
    const { manifest, lang, update } = this.props;
    return (
      <MetadataEditor
        target={manifest}
        lang={lang}
        update={update}
        behaviorConfig={configuration.behavior.Manifest}
        fieldConfig={
          configuration.propertyFields.Manifest
        }
      />
    );
  };

  editors = {
    'Annotation': this.renderAnnotationEditor,
    'Canvas': this.renderCanvasEditor,
    'Manifest': this.renderManifestEditor,
  };

  renderPropertyEditorAsList = (propertyTables, configuration) => {
    const { classes } = this.props;
    return propertyTables.map(resourceType => {
      if (!(resourceType in this.editors)) {
        return ''
      }
      return (
        <SimplePanel
          key={`${resourceType}_property_editor`}
          labelKey={`Properties.${resourceType}`}
          label={resourceType}
          classes={classes}
        >
          {this.editors[resourceType](configuration)}
        </SimplePanel>
      );

    });
  }

  renderPropertyEditorAsAccordion = (propertyTables, configuration) => {
    const { classes } = this.props;
    return propertyTables.map((resourceType, index) => {
      if (!(resourceType in this.editors)) {
        return ''
      }
      return (
        <AccordionPanel
          key={`${resourceType}_property_editor`}
          defaultExpanded={index === 0}
          labelKey={`Properties.${resourceType}`}
          label={resourceType}
          classes={classes}
        >
          {this.editors[resourceType](configuration)}
        </AccordionPanel>
      );
    });
  }

  getAnnotationType = () => {
    const { annotation } = this.props;
    return annotation
      ? [
          annotation.body ? annotation.body.type : '',
          annotation.motivation,
        ].join('::')
      : null;
  };

  getPropertyTables = propertyPanelConfig => {
    const { canvas, annotation } = this.props;
    let smallestSelectedType = 'null';
    if (canvas) {
      smallestSelectedType = 'Canvas';
    }
    if (annotation) {
      smallestSelectedType = 'Annotation';
    }
    
    return propertyPanelConfig.selectionVisibility[smallestSelectedType];
  };

  renderConfiguration = () => (
    <EditorConsumer>
      {configuration => {
        const propertyPanelConfig = configuration.propertyPanel;
        const propertyTables = this.getPropertyTables(propertyPanelConfig);
        if (propertyPanelConfig.selectionType === 'list') {
          return this.renderPropertyEditorAsList(propertyTables, configuration);
        } else if (propertyPanelConfig.selectionType === 'accordion') {
          return this.renderPropertyEditorAsAccordion(propertyTables, configuration);
        }
        return 'invalid selection configuration';
      }}
    </EditorConsumer>
  )

  render() {
    const {
      classes,
      update,
    } = this.props;
    const { mirrorTranslationOpen } = this.state;

    return (
      <div className={classes.root}>
        {this.renderTranslationHeader()}
        {this.renderConfiguration()}
        <TranslationDialog
          resources={this.props.resources}
          // manifest={manifest}
          open={mirrorTranslationOpen}
          handleClose={this.closeTranslations}
          update={update}
        />
      </div>
    );
  }
}

Properties.propTypes = {
  /** The loaded manifest */
  manifest: PropTypes.object,
  /** Selected canvas */
  canvas: PropTypes.object,
  /** Selected annotation */
  annotation: PropTypes.object,
  /* update property */
  update: PropTypes.func,
  /* hides translation options */
  noTranslation: PropTypes.bool.isRequired,
};

Properties.defaultProps = {
  manifest: null,
  canvas: null,
  annotation: null,
  update: () => () => {},
  noTranslation: false,
};

export default withStyles(style)(Properties);
