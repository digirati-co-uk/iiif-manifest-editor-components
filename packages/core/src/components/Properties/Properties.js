import React from 'react';
import PropTypes from 'prop-types';
import { Typography, InputLabel, withStyles } from '@material-ui/core';
import { Translate } from '@material-ui/icons';

import { EditorConsumer } from '../EditorContext/EditorContext';
import MetadataEditor from '../MetadataEditor/MetadataEditor';
import LanguagesDropdown from '../LanguagesDropdown/LanguagesDropdown';
import ButtonWithTooltip from '../ButtonWithTooltip/ButtonWithTooltip';
import TranslationDialog from './Properties.TranslationDialog';
import { updateWithMeta } from '../../utils/IIIFResource';

const style = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
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
});

class Properties extends React.Component {
  state = {
    mirrorTranslationOpen: false,
  };

  openTanslations = () => {
    this.setState({
      mirrorTranslationOpen: true,
    });
  };

  closeTanslations = () => {
    this.setState({
      mirrorTranslationOpen: false,
    });
  };

  update = (target, property, lang, value) => {
    updateWithMeta(target, property, lang, value, (result, prop, lng, val) =>
      this.props.update(result, prop, lng, val)
    );
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
              onClick={this.openTanslations}
            >
              <Translate />
            </ButtonWithTooltip>
            <InputLabel className={classes.currentLanguageLabel}>
              Current Language
            </InputLabel>
            <LanguagesDropdown changeLanguage={changeLanguage} lang={lang} />
          </div>
        )}
        {annotation && (
          <React.Fragment>
            <Typography variant="h6">Annotation</Typography>
            <MetadataEditor target={annotation} lang={lang} update={update} />
            {annotationType}
            <EditorConsumer>
              {configuration => {
                const form = configuration.annotation[annotationType];
                return (
                  form &&
                  typeof form.propertyEditor === 'function' &&
                  React.createElement(form.propertyEditor, {
                    update: this.update,
                    target: annotation,
                  })
                );
              }}
            </EditorConsumer>
          </React.Fragment>
        )}
        {canvas && (
          <React.Fragment>
            <Typography variant="h6">Canvas</Typography>
            <MetadataEditor target={canvas} lang={lang} update={update} />
          </React.Fragment>
        )}
        <Typography variant="h6">Manifest</Typography>
        <MetadataEditor target={manifest} lang={lang} update={update} />
        <TranslationDialog
          manifest={manifest}
          open={mirrorTranslationOpen}
          handleClose={this.closeTanslations}
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
