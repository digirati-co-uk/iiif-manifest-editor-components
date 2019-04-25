import * as React from 'react';
import * as PropTypes from 'prop-types';
import {
  Typography,
  InputLabel,
  withStyles,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from '@material-ui/core';
import { Translate, ExpandMore } from '@material-ui/icons';

import { EditorConsumer } from '../EditorContext/EditorContext';
import MetadataEditor from '../MetadataEditor/MetadataEditor';
import LanguagesDropdown from '../LanguagesDropdown/LanguagesDropdown';
import ButtonWithTooltip from '../ButtonWithTooltip/ButtonWithTooltip';
import TranslationDialog from './Properties.TranslationDialog';
import { updateWithMeta } from '../../utils/IIIFResource';

import { Label } from '../LabelContext/LabelContext';

const style = theme => ({
  root: {
    padding: '1rem',
    width: '100%',
  },
  translationBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentLanguageLabel: {
    flex: 1,
    textAlign: 'right',
    padding: '0 1rem 0 0',
  },
  resourceBlock: {
    paddingBottom: theme.spacing.unit,
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
  },
});

const StyledExpansionPanel = withStyles(theme => ({
  root: {
    //border: '1px solid rgba(0,0,0,.125)',
    borderLeft: 0,
    borderRight: 0,
    borderTop: '1px solid rgba(0,0,0,.125)',
    borderBottom: '1px solid rgba(0,0,0,.125)',
    boxShadow: 'none',
    margin: `0 -${2 * theme.spacing.unit}px`,
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  },
  expanded: {
    margin: `auto -${2 * theme.spacing.unit}px`,
  },
}))(ExpansionPanel);

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

  renderPropertyEditorAsList = (propertyTables, configuration) => {
    const { classes, manifest, canvas, annotation, lang, update } = this.props;
    const annotationType = this.getAnnotationType();
    const form = configuration.annotation[annotationType];
    return (
      <React.Fragment>
        {propertyTables.map(resourceType => {
          switch (resourceType) {
            case 'Annotation':
              return (
                annotation && (
                  <div className={classes.resourceBlock}>
                    <Typography variant="h6">
                      <Label name="Properties.Annotation">
                        Annotation
                      </Label>
                    </Typography>
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
                  </div>
                )
              );
            case 'Canvas':
              return (
                canvas && (
                  <div className={classes.resourceBlock}>
                    <Typography variant="h6">
                      <Label name="Properties.Canvas">Canvas</Label>
                    </Typography>
                    <MetadataEditor
                      target={canvas}
                      lang={lang}
                      update={update}
                      behaviorConfig={configuration.behavior.Canvas}
                      fieldConfig={
                        configuration.propertyFields.Canvas
                      }
                    />
                  </div>
                )
              );
            case 'Manifest':
              return (
                manifest && (
                  <div className={classes.resourceBlock}>
                    <Typography variant="h6">
                      <Label name="Properties.Manifest">
                        Manifest
                      </Label>
                    </Typography>
                    <MetadataEditor
                      target={manifest}
                      lang={lang}
                      update={update}
                      behaviorConfig={configuration.behavior.Manifest}
                      fieldConfig={
                        configuration.propertyFields.Manifest
                      }
                    />
                  </div>
                )
              );
            default:
              return '';
          }
        })}
      </React.Fragment>
    );
  }

  renderPropertyEditorAsAccordion = (propertyTables, configuration) => {
    const { classes, manifest, canvas, annotation, lang, update } = this.props;
    const annotationType = this.getAnnotationType();
    const form = configuration.annotation[annotationType];
    return (
      <React.Fragment>
        {propertyTables.map((resourceType, index) => {
          switch (resourceType) {
            case 'Annotation':
              return (
                annotation && (
                  <StyledExpansionPanel
                    key="annotation_property_editor"
                    defaultExpanded={index === 0}
                  >
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMore />}
                    >
                      <Typography variant="h6">
                        <Label name="Properties.Annotation">
                          Annotation
                        </Label>
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <div className={classes.resourceBlock}>
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
                      </div>
                    </ExpansionPanelDetails>
                  </StyledExpansionPanel>
                )
              );
            case 'Canvas':
              return (
                canvas && (
                  <StyledExpansionPanel
                    key="canvas_property_editor"
                    defaultExpanded={index === 0}
                  >
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMore />}
                    >
                      <Typography variant="h6">
                        <Label name="Properties.Canvas">Canvas</Label>
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <div className={classes.resourceBlock}>
                        <MetadataEditor
                          target={canvas}
                          lang={lang}
                          update={update}
                          behaviorConfig={
                            configuration.behavior.Canvas
                          }
                          fieldConfig={
                            configuration.propertyFields.Canvas
                          }
                        />
                      </div>
                    </ExpansionPanelDetails>
                  </StyledExpansionPanel>
                )
              );
            case 'Manifest':
              return (
                manifest && (
                  <StyledExpansionPanel
                    key="manifest_property_editor"
                    defaultExpanded={index === 0}
                  >
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMore />}
                    >
                      <Typography variant="h6">
                        <Label name="Properties.Manifest">
                          Manifest
                        </Label>
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <div className={classes.resourceBlock}>
                        <MetadataEditor
                          target={manifest}
                          lang={lang}
                          update={update}
                          behaviorConfig={
                            configuration.behavior.Manifest
                          }
                          fieldConfig={
                            configuration.propertyFields.Manifest
                          }
                        />
                      </div>
                    </ExpansionPanelDetails>
                  </StyledExpansionPanel>
                )
              );
            default:
              return '';
          }
        })}
      </React.Fragment>
    );
  }

  getAnnotationType = () => {
    const { annotation } = this.props.annotation;
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

  render() {
    const {
      classes,
      manifest,
      update,
    } = this.props;
    const { mirrorTranslationOpen } = this.state;

    return (
      <div className={classes.root}>
        {this.renderTranslationHeader()}
        <EditorConsumer>
          {configuration => {
            //const form = configuration.annotation[annotationType];
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
        <TranslationDialog
          manifest={manifest}
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
