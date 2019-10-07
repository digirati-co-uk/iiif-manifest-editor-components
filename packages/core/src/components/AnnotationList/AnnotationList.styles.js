const style = theme => ({
  list: {
    width: '100%',
    padding: theme.spacing.unit,
    position: 'relative',
  },
  annotationDraggable: {
    userSelect: 'none',
    padding: `${theme.spacing.unit / 2}px 0 ${theme.spacing.unit / 2}px ${
      theme.spacing.unit
    }px`,
    margin: `0`,
    background: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'stretch',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  annotationDragging: {
    outline: `2px solid ${theme.palette.primary.main}`,
  },
  defaultNoAnnotationIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default style;
