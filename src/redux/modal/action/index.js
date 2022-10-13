// constants
import * as constants from "../constants";

export const openModal =
  (modalType = 0, successAction, mPayloads, editMode = false) =>
  (dispatch) => {
    console.log("editMode");
    console.log(editMode);
    dispatch({
      type: editMode ? constants.OPEN_EDIT_MODAL : constants.OPEN_MODAL,
      payload: {
        modalType: modalType,
        successAction: successAction,
        mPayloads: mPayloads,
      },
    });
  };

export const closeModal =
  (modalType = 0) =>
  (dispatch) => {
    console.log("Close Modal Dispatch");
    dispatch({ type: constants.CLOSE_MODAL, payload: modalType });
  };

export const SubscripionsType = (value, dispatch) => {
  dispatch({ type: constants.SUBSCRIPIONS_TYPE, payload: value });
};
