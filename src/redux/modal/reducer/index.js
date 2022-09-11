// constants
import * as constants from "../constants";
const INITIAL_STATE = {
  modalType: 0,
  visible: false,
  successAction: null,
  mPayloads: null,
  editMode: false,
};
export const modalReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case constants.OPEN_MODAL:
      return {
        ...state,
        visible: true,
        modalType: action.payload.modalType,
        successAction: action.payload.successAction,
      };
    case constants.OPEN_EDIT_MODAL:
      return {
        ...state,
        visible: true,
        modalType: action.payload.modalType,
        successAction: action.payload.successAction,
        editMode: true,
        mPayloads: action.payload.mPayloads,
      };
    case constants.CLOSE_MODAL:
      return {
        ...state,
        visible: false,
        modalType: 0,
        successAction: null,
        mPayloads: null,
        editMode: false,
      };
    default:
      return state;
  }
};
