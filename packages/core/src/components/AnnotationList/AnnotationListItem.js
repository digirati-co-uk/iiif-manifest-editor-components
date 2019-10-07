import * as React from 'react';
import { Typography, withStyles } from '@material-ui/core';
import LocaleString from '../LocaleString/LocaleString';
import { locale, getInternalAnnotationType } from '../../utils/IIIFResource';
import { EditorConsumer } from '../EditorContext/EditorContext';
import Tooltip from '../DefaultTooltip/DefaultTooltip';
import style from './AnnotationListItem.styles';

const getIconForAnnotationType = (annotationDefinition, color) => 
  annotationDefinition
    ? (
        <Tooltip title={annotationDefinition.iconToolTip}>
          {React.createElement(annotationDefinition.icon, {
            color,
          })}
        </Tooltip>
      )
    : '';

const AnnotationListItem = ({
  classes,
  annotation,
  lang,
  onSelect,
  isSelected,
  selectedColor,
}) => {
  const internalAnnotationType = getInternalAnnotationType(annotation);
  const textColor = isSelected ? selectedColor : 'inherit';
  return (
    <EditorConsumer>
      {configuration => {
        const annotationDefinition = configuration.annotation[internalAnnotationType];
        return (
        <div
          key={annotation.id}
          className={classes.main}
          onClick={() => onSelect(annotation)}
        >
          {getIconForAnnotationType(annotationDefinition, textColor)}
          <div
            className={classes.textBlock}
            title={locale(annotation.label, lang, annotation.id)}
          >
            <Typography
              color={textColor}
              variant="subtitle2"
              className={classes.label}
            >
              <LocaleString fallback={annotation.id} lang={lang}>
                {annotation.label}
              </LocaleString>
            </Typography>
          </div>
        </div>
      )}
    }
    </EditorConsumer>
  );
};

AnnotationListItem.defaultProps = {
  selectedColor: 'primary',
};

export default withStyles(style)(AnnotationListItem);
