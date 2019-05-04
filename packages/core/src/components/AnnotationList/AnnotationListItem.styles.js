export default theme => ({
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
  label: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
});
