import { addAlphaToHex } from '../../utils/colors';

export default theme => ({
  '@global': {
    '.navigator': {
      zIndex: 1000,
    },
  },
  noCanvasSelectedMessage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  root: {
    overflow: 'hidden',
    position: 'relative',
    webkitUserSelect: 'none',
    mozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
  },
  container: {
    width: '100%',
    position: 'absolute',
    height: '100%',
    flex: 1,
    top: 0,
    left: 0,
  },
  canvasBackground: {
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.2)',
    position: 'relative',
  },
  zoomButtons: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  boxClass: {
    outline: '1px solid transparent',
    background: addAlphaToHex(theme.palette.primary.main, 0.6),
  },
  boxClassSelected: {
    outline: `1px solid ${theme.palette.primary.main}`,
    background: addAlphaToHex(theme.palette.primary.main, 0.9),
  },
  boxClassSecondary: {
    outline: '1px solid transparent',
    background: addAlphaToHex(theme.palette.secondary.main, 0.6),
  },
  boxClassSecondarySelected: {
    outline: `1px solid ${theme.palette.secondary.main}`,
    background: addAlphaToHex(theme.palette.secondary.main, 0.9),
  },
});