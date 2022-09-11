import * as constants from "../constatns";

export const startLogin = (data) => (dispatch) => {
  dispatch({ type: constants.LOGIN_SUCCESS, payload: { ...data } });
};
export const startLogout = (data) => (dispatch) => {
  dispatch({ type: constants.START_LOGOUT });
};
