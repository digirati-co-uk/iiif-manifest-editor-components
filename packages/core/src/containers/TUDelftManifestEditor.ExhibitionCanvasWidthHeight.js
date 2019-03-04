import * as React from 'react';
import { FormControl, FormLabel, withStyles } from '@material-ui/core';
import ContainerDimensions from 'react-container-dimensions';

const WIDTH_PREFIX = 'w-';
const HEIGHT_PREFIX = 'h-';

const styles = theme => ({
  group: {
    color: 'white',
  },
  selectorMain: {
    border: `1px solid ${theme.palette.grey[400]}`,
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
  },
  selection: {
    position: 'absolute',
    top: 0,
    left: 0,
    background: theme.palette.grey[200],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class ExhibitionCanvasWidthHeight extends React.Component {
  // helper function to get an element's exact position
  static getPosition = el => {
    const rect = el.getBoundingClientRect();
    return {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
    };
  };

  getBehaviours = filterFn => {
    const result = this.props.target ? this.props.target.behavior || [] : [];
    return filterFn ? result.filter(filterFn) : result;
  };

  onHandleChange = width => ev => {
    const { update, target, maxWidth, maxHeight } = this.props;
    const boxPosition = ExhibitionCanvasWidthHeight.getPosition(
      ev.currentTarget
    );
    update(
      target,
      'behavior',
      null,
      this.getBehaviours(
        behaviour =>
          !behaviour.startsWith(WIDTH_PREFIX) &&
          !behaviour.startsWith(HEIGHT_PREFIX)
      ).concat([
        WIDTH_PREFIX +
          Math.ceil((ev.pageX - boxPosition.x) / (width / maxWidth)),
        HEIGHT_PREFIX +
          Math.ceil((ev.pageY - boxPosition.y) / (width / maxHeight)),
      ])
    );
  };

  render() {
    const {
      classes,
      maxWidth,
      maxHeight,
      defaultWidth,
      defaultHeight,
    } = this.props;
    const behaviours = this.getBehaviours(
      behaviour =>
        behaviour.startsWith(WIDTH_PREFIX) ||
        behaviour.startsWith(HEIGHT_PREFIX)
    );
    console.log('behaviours', behaviours);
    return (
      <FormControl component="fieldset">
        <FormLabel component="legend">
          Canvas Width/Height in Exhibition View
        </FormLabel>
        <ContainerDimensions>
          {({ width }) => {
            const w =
              parseInt(
                behaviours
                  .filter(behaviour => behaviour.startsWith(WIDTH_PREFIX))
                  .concat([`${WIDTH_PREFIX}${defaultWidth}`])[0]
                  .replace(WIDTH_PREFIX, ''),
                10
              ) *
              (width / maxWidth);
            const h =
              parseInt(
                behaviours
                  .filter(behaviour => behaviour.startsWith(HEIGHT_PREFIX))
                  .concat([`${HEIGHT_PREFIX}${defaultHeight}`])[0]
                  .replace(HEIGHT_PREFIX, ''),
                10
              ) *
              (width / maxHeight);
            return (
              <div
                style={{
                  width,
                  height: width,
                }}
                className={classes.selectorMain}
                onClick={this.onHandleChange(width)}
              >
                <div
                  style={{
                    width: w,
                    height: h,
                  }}
                  className={classes.selection}
                >
                  {
                    behaviours
                      .filter(behaviour => behaviour.startsWith(WIDTH_PREFIX))
                      .concat([`${WIDTH_PREFIX}${defaultWidth}`])[0]
                  }
                  &nbsp;x&nbsp;
                  {
                    behaviours
                      .filter(behaviour => behaviour.startsWith(HEIGHT_PREFIX))
                      .concat([`${HEIGHT_PREFIX}${defaultHeight}`])[0]
                  }
                </div>
              </div>
            );
          }}
        </ContainerDimensions>
      </FormControl>
    );
  }
}

ExhibitionCanvasWidthHeight.defaultProps = {
  maxWidth: 12,
  maxHeight: 12,
  defaultWidth: 4,
  defaultHeight: 4,
};

export default withStyles(styles)(ExhibitionCanvasWidthHeight);
