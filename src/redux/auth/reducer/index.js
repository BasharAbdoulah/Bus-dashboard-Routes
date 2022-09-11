import * as constants from "../constatns";

const INITIAL_STATE = {
  token: null,
  type: null,
  id: null,
  UserName: null,
  email: null,
  role: [],
  isLoggedIn: false,
  companyID: null,
};

export const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case constants.LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        Password: action.payload.Password,
        UserName: action.payload.UserName,
        id: action.payload.id,
        isLoggedIn: true,
        role: action.payload.role,
        companyID: action.payload.companyID,
      };
    case constants.START_LOGOUT:
      return {
        ...state,
        token: null,
        Password: null,
        UserName: null,
        id: null,
        role: [],
        isLoggedIn: false,
        companyID: null,
      };
    default:
      return state;
  }
};
