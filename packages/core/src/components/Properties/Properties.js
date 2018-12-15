import React from 'react';
import PropTypes from 'prop-types';
import { Typography, InputLabel } from '@material-ui/core';
import { Translate } from '@material-ui/icons';

import MetadataEditor from '../MetadataEditor/MetadataEditor';
import LanguagesDropdown from '../LanguagesDropdown/LanguagesDropdown';
import ButtonWithTooltip from '../ButtonWithTooltip/ButtonWithTooltip';

const Properties = ({
  manifest,
  canvas,
  annotation,
  lang,
  changeLanguage,
  update,
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem',
    }}
  >
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <ButtonWithTooltip
        title="Launch mirror translation tool"
        onClick={() =>
          alert('to-do / 纷扰 / lío / histoire / Theater / trambusto / 大騒ぎ')
        }
      >
        <Translate />
      </ButtonWithTooltip>
      <InputLabel
        style={{
          flex: 1,
          textAlign: 'right',
          padding: '0 1rem 0 0',
        }}
      >
        Current Language
      </InputLabel>
      <LanguagesDropdown changeLanguage={changeLanguage} lang={lang} />
    </div>
    {annotation && (
      <React.Fragment>
        <Typography variant="h6">Annotation</Typography>
        <MetadataEditor target={annotation} lang={lang} update={update} />
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
  </div>
);

Properties.propTypes = {
  /** The loaded manifest */
  manifest: PropTypes.object,
  /** Selected canvas */
  canvas: PropTypes.object,
  /** Selected annotation */
  annotation: PropTypes.object,
  update: PropTypes.func,
};

Properties.defaultProps = {
  manifest: null,
  canvas: null,
  annotation: null,
  update: () => () => {},
};

export default Properties;
