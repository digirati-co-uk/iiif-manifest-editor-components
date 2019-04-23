export default theme => ({
  head: {},
  headAddressLine: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing.unit,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  urlInputStyles: {
    width: '100%',
  },
  loadResourceIconSpacer: {
    width: 50,
    marginLeft: 8,
  },
  selectHideout: {
    width: '100%',
    height: 0,
    overflow: 'hidden',
  },
  historyIconHolder: {
    cursor: 'pointer',
  },
});