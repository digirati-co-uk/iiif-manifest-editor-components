export default theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  content: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: '16px',
    display: 'flex',
    background: 'white',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  }
});