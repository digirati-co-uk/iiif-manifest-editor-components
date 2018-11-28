/**
 * React
 * @param {*} state - current state
 * @param {*} action - action descriptor
 */
const DragAndDropReducer = (state, action) => {
  switch (action.type) {
    case 'START_DRAG':
    case 'DROPPED':
    default:
      return state;
  }
};
