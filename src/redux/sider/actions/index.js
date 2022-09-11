import * as constants from "../constants";

export const openSider = () => (dispatch) => {
  dispatch({ type: constants.OPEN_SIDER, payload: true });
};

export const closeSider = () => (dispatch) => {
  dispatch({ type: constants.CLOSE_SIDER, payload: false });
};
