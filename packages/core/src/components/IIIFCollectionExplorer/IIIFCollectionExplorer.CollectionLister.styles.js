export default theme => ({
  list: {
    display: 'flex',
    flexWrap: 'wrap',
    overflowX: 'hidden',
    overflowY: 'auto',
    position: 'relative',
  },
  listItem: {
    display: 'block',
    width: '100%',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  info: {
    width: 'calc(100% - 140px)',
    padding: theme.spacing.unit,
  },
  infoLong: {
    width: 'calc(100% - 40px)',
    padding: theme.spacing.unit,
  },
  moreVert: {
    width: 40,
    minHeight: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnail: {
    width: 100,
  },
  placeholder: {
    display: 'flex',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    width: '100%',
  },
});
