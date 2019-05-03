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

export default style;