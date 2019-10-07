export default theme => ({
  keyValuePair: {
    border: `1px solid ${theme.palette.action.disabled}`,
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    borderRadius: theme.shape.borderRadius,
  },
  keyValuePairFocus: {
    border: `2px solid ${theme.palette.primary.main}`,
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    borderRadius: theme.shape.borderRadius,
    transition: `border-color ${theme.transitions.duration.shorter} ${
      theme.transitions.easing.easeOut
    }, border-width ${theme.transitions.duration.shorter} ${
      theme.transitions.easing.easeOut
    }, padding-left ${theme.transitions.duration.shorter} ${
      theme.transitions.easing.easeOut
    }`,
  },
  keyValuePairContent: {
    marginTop: -theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
  },
  keyValuePairField: {
    '&>div>fieldset': {
      border: '0 none !important',
      '&>legend': {
        background: '#fff',
      },
    },
  },
  htmlSwitchWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginBottom: theme.spacing.unit,
  },
  htmlSwitch: Object.assign({}, theme.typography.overline, {
    position: 'absolute',
    top: 0,
    right: 0,
    fontWeight: 'bold',
    background: '#fff',
    color: theme.palette.primary.main,
    padding: '2px 8px 3px',
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    cursor: 'pointer',
    lineHeight: 1,
    outline: 0,
  }),
  htmlFieldWrapper: {
    borderTop: '1px solid #ccc',
    marginTop: theme.spacing.unit,
    position: 'relative',
  },
  htmlEditorInputLabel: {
    background: '#fff',
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit / 2,
    marginLeft: -theme.spacing.unit,
  },
});