import { layoutConstants } from '../constants';

const toggleRightBar = () => {
  return {
    type: layoutConstants.TOGGLE_RIGHT_BAR
  };
};

const toggleSideBar = () => {
  return {
    type: layoutConstants.TOGGLE_SIDE_BAR
  };
};

export const layoutActions = {
  toggleRightBar,
  toggleSideBar
};
