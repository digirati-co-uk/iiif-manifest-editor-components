import * as React from 'react';
import * as PropTypes from 'prop-types';
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
import ManifestEditorDialog from '../ManifestEditorDialog/ManifestEditorDialog'


const processLevel2 = (obj, key_prefix,) => {
  key_prefix = key_prefix || '';
  return Object.entries(obj).reduce((result, [key, value]) => {
    if (key in ['items', 'annotations', 'service']) {
      return result;
    }
    let newKey = `${key_prefix}.${key}`;
    if (value.constructor === Object) {
      if (
        Object.keys(value).filter(
          label => label === '@none' || label.length === 2
        ).length === Object.keys(value).length
      ) {
        result.push([newKey, value]);
      } else {
        result = result.concat(processLevel2(value, newKey));
      }
    } else if (Array.isArray(value)) {
      value.forEach((item, idx) => {
        result = result.concat(processLevel2(item, `${newKey}.${idx}`));
        return result;
      });
    }
    return result;
  }, []);
};

class TranslationDialog extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.open === this.props.open || nextProps.open;
  }

  render() {
      const { resources, open, handleClose, update } = this.props;
      if (!resources) {
        return null;
      }
      let languageProps = Object.entries(resources)
        .reduce(
          (langProps, [key, value]) => {
            const resourceLangProps = processLevel2(value, `${key}>>`);
            if (resourceLangProps.length) {
              langProps = langProps.concat(resourceLangProps)
            }
            return langProps
          }
        , []);
      let availableLanguages = Array.from(
        languageProps.reduce(
          (result, [key, value]) =>
            new Set([...new Set(Object.keys(value)), ...result]),
          new Set()
        )
      );
    
      return (
        <ManifestEditorDialog
          open={open}
          handleClose={handleClose}
          closeLabel="Done"
          title="Mirror Translation Tool"
        >
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
                <TableRow key={`translation_row_${key}`}>
                  <TableCell key={`translations_${key}`}>{key}</TableCell>
                  {availableLanguages.map(languageCode => (
                    <TableCell key={`translations_${key}_${languageCode}`}>
                      <TextField
                        value={translations[languageCode] || ''}
                        onChange={ev =>
                          update(
                            resources[key.split('>>')[0]],
                            key.split('>>')[1].substr(1),
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
        </ManifestEditorDialog>
      );
  }
}

TranslationDialog.propTypes = {
  /** The resources to translate */
  resources: PropTypes.object,
  /** is the dialog open */
  open: PropTypes.bool.isRequired,
  /** handling the dialog close */
  handleClose: PropTypes.func.isRequired,
  /** Method that updates the value */
  update: PropTypes.func.isRequired,
};

TranslationDialog.defaultProps = {
  manifest: null,
  open: false,
};

export default TranslationDialog;