import * as constants from "../constants";

const INITIAL_STATE = {
  open: true,
  active: true,
};

export const siderReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case constants.OPEN_SIDER:
      return {
        ...state,
        open: action.payload,
      };
    case constants.CLOSE_SIDER:
      return {
        ...state,
        open: action.payload,
      };
    default:
      return state;
  }
};
