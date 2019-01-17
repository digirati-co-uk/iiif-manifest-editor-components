import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@material-ui/core';

const processLevel = (obj, key_prefix) => {
  key_prefix = key_prefix || '';
  return Object.entries(obj).reduce((result, [key, value]) => {
    let newKey = `${key_prefix}.${key}`;
    if (value.constructor === Object) {
      if (
        Object.keys(value).filter(
          label => label === '@none' || label.length === 2
        ).length === Object.keys(value).length
      ) {
        result.push([newKey, value]);
      } else {
        result = result.concat(processLevel(value, newKey));
      }
    } else if (value.constructor === Array) {
      value.forEach(
        (item, idx) =>
          (result = result.concat(processLevel(item, `${newKey}.${idx}`)))
      );
    }
    return result;
  }, []);
};

const TranslationDialog = ({ manifest, open, handleClose, update }) => {
  let languageProps = processLevel(manifest).filter(
    ([key]) => !key.endsWith('.service')
  );
  let availableLanguages = Array.from(
    languageProps.reduce(
      (result, [key, value]) =>
        new Set([...new Set(Object.keys(value)), ...result]),
      new Set()
    )
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="paper"
      maxWidth="md"
      aria-labelledby="mirror-translation-tool"
    >
      <DialogTitle id="mirror-translation-tool">
        Mirror translation tool
      </DialogTitle>
      <DialogContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell key={'translations_header_position'}>
                Position
              </TableCell>
              {availableLanguages.map(languageCode => (
                <TableCell key={`translations_header_${languageCode}`}>
                  {languageCode}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {languageProps.map(([key, translations]) => (
              <TableRow>
                <TableCell key={`translations_${key}`}>{key}</TableCell>
                {availableLanguages.map(languageCode => (
                  <TableCell key={`translations_${key}_${languageCode}`}>
                    <TextField
                      value={translations[languageCode] || ''}
                      onChange={ev =>
                        update(
                          manifest,
                          key.substr(1),
                          languageCode,
                          ev.target.value
                        )
                      }
                      margin="dense"
                      variant="outlined"
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

TranslationDialog.propTypes = {
  /** The manifest to translate */
  manifest: PropTypes.object.isRequired,
  /** is the dialog open */
  open: PropTypes.bool.isRequired,
  /** handling the dialog close */
  handleClose: PropTypes.func.isRequired,
  /** Method that updates the value */
  update: PropTypes.func.isRequired,
};

TranslationDialog.defaultProps = {
  manifest: [],
  open: false,
};

export default TranslationDialog;
