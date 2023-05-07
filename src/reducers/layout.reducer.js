import { layoutConstants } from '../constants';

const initLayout = {
  rightBar: false,
  sideBar: true
};

export function layout(state = initLayout, action) {
  switch (action.type) {
    case layoutConstants.TOGGLE_RIGHT_BAR:
      return {
        ...state,
        rightBar: !state.rightBar
      };
    case layoutConstants.TOGGLE_SIDE_BAR:
      return {
        ...state,
        sideBar: !state.sideBar
      };
    default:
      return state;
  }
}
