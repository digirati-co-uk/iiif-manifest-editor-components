const styles = theme => ({
  root: {},
  formRow: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  textField: {
    width: 'calc(100% - 70px)',
  },
  factSheet: {
    width: '100%',
    marginTop: 0,
    '&>dt': {
      fontWeight: 'bold',
      marginRight: theme.spacing.unit,
    },
    '&>dd': {
      marginRight: theme.spacing.unit * 2,
      marginInlineStart: 0,
    },
  },
  fact: {
    fontSize: 12,
    float: 'left',
  },
  dndUpload: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit / 2,
    marginLeft: theme.spacing.unit,
    width: 62,
    height: 6 * theme.spacing.unit,
    border: `2px dashed lightgray`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.spacing.unit / 2,
  },
});

export default styles;
