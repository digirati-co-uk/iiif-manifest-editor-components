import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Typography, InputLabel, withStyles } from '@material-ui/core';
import { Translate } from '@material-ui/icons';

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
    flexDirection: 'column',
  },
});

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
      console.log(result, prop, lng, val);
      this.props.update(result, prop, lng, val);
    });
    // updateWithMetaB(target, property, lang, value).then(
    //   ({ result, prop, lan, val }) => this.props.update(result, prop, lan, val)
    // );
  };

  render() {
    const {
      classes,
      manifest,
      canvas,
      annotation,
      lang,
      changeLanguage,
      update,
      noTranslation,
    } = this.props;
    const { mirrorTranslationOpen } = this.state;
    const annotationType = annotation
      ? [
          annotation.body ? annotation.body.type : '',
          annotation.motivation,
        ].join('::')
      : null;

    return (
      <div className={classes.root}>
        {!noTranslation && (
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
        )}
        <EditorConsumer>
          {configuration => {
            const form = configuration.annotation[annotationType];
            return (
              <React.Fragment>
                {annotation && (
                  <div className={classes.resourceBlock}>
                    <Typography variant="h6">
                      <Label name="Properties.Annotation">Annotation</Label>
                    </Typography>
                    <MetadataEditor
                      target={annotation}
                      lang={lang}
                      update={update}
                      behaviorConfig={configuration.behavior.Annotation}
                    />
                    {annotationType}
                    {form &&
                      typeof form.propertyEditor === 'function' &&
                      React.createElement(form.propertyEditor, {
                        update: this.update,
                        target: annotation,
                      })}
                  </div>
                )}
                {canvas && (
                  <div className={classes.resourceBlock}>
                    <Typography variant="h6">
                      <Label name="Properties.Canvas">Canvas</Label>
                    </Typography>
                    <MetadataEditor
                      target={canvas}
                      lang={lang}
                      update={update}
                      behaviorConfig={configuration.behavior.Canvas}
                    />
                  </div>
                )}
                <div className={classes.resourceBlock}>
                  <Typography variant="h6">
                    <Label name="Properties.Manifest">Manifest</Label>
                  </Typography>
                  <MetadataEditor
                    target={manifest}
                    lang={lang}
                    update={update}
                    behaviorConfig={configuration.behavior.Manifest}
                  />
                </div>
              </React.Fragment>
            );
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
