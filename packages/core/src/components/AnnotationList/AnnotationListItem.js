import React from 'react';
import { Typography, withStyles } from '@material-ui/core';
import LocaleString from '../LocaleString/LocaleString';
import { EditorConsumer } from '../EditorContext/EditorContext';

const style = theme => ({
  main: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'stretch',
    maxWidth: 'calc(100% - 40px)',
  },
  textBlock: {
    flex: 1,
    padding: '0 0 0 1rem',
    overflow: 'hidden',
  },
  typo: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
});

const AnnotationListItem = ({
  classes,
  annotation,
  lang,
  onSelect,
  isSelected,
}) => {
  const internalAnnotationType = [
    annotation.body.type,
    annotation.motivation,
  ].join('::');
  const textColor = isSelected ? 'primary' : 'inherit';
  return (
    <EditorConsumer>
      {configuration => (
        <div
          key={annotation.id}
          className={classes.main}
          onClick={() => onSelect(annotation)}
        >
          {configuration.annotation[internalAnnotationType]
            ? configuration.annotation[internalAnnotationType].icon({
                color: textColor,
              })
            : ''}
          <div
            className={classes.textBlock}
            title={
              annotation.label && annotation.label[lang]
                ? annotation.label[lang]
                : annotation.id
            }
          >
            <Typography
              color={textColor}
              variant="subtitle2"
              className={classes.typo}
            >
              <LocaleString fallback={annotation.id} lang={lang}>
                {annotation.label}
              </LocaleString>
            </Typography>
          </div>
        </div>
      )}
    </EditorConsumer>
  );
};
export default withStyles(style)(AnnotationListItem);
