// redux
import AddRoute from "Component/Modals/AddCountry/AddRoute";
import AddStation from "Component/Modals/AddCountry/AddStation";
import AddRouteStation from "Component/Modals/AddCountry/AddRouteStation";
import AddBus from "Component/Modals/Bus/AddBus";
import AddDriver from "Component/Modals/Driver/AddDriver";
import AddCompany from "Component/Modals/Bus/AddCompany";
import AddUserCompany from "Component/Modals/Bus/AddUserCompany";
import AddPromoter from "Component/Modals/Promoter/AddPromoter";
import AddBusCompany from "Component/Modals/Company/AddBusCompany";
import AddDriverCompany from "Component/Modals/Company/AddDriverCompany";
import AddInspector from "Component/Modals/Inspector/AddInspector";
import { connect } from "react-redux";

// components

// modal types
import * as constants from "redux/modal/constants";
import AddRole from "Component/Modals/Role/AddRole";
import RequestRoute from "Component/Modals/Company/RequestRoute";
const ModalContainer = ({ visible, modalType }) => {
  return (
    <>
      {modalType === constants.modalType_AddRoute && (
        <AddRoute visible={visible} />
      )}
      {modalType === constants.modalType_AddStation && (
        <AddStation visible={visible} />
      )}
      {modalType === constants.modalType_AddRouteStation && (
        <AddRouteStation visible={visible} />
      )}
      {modalType === constants.modalType_AddRole && (
        <AddRole visible={visible} />
      )}
      {modalType === constants.modalType_AddBus && <AddBus visible={visible} />}
      {modalType === constants.modalType_AddDriver && (
        <AddDriver visible={visible} />
      )}
      {modalType === constants.modalType_AddCompany && (
        <AddCompany visible={visible} />
      )}
      {modalType === constants.modalType_AddUserCompany && (
        <AddUserCompany visible={visible} />
      )}
      {modalType === constants.modalType_AddPromoter && (
        <AddPromoter visible={visible} />
      )}
      {modalType === constants.modalType_AddBusCompany && (
        <AddBusCompany visible={visible} />
      )}
      {modalType === constants.modalType_AddDriverCompany && (
        <AddDriverCompany visible={visible} />
      )}
      {modalType === constants.modalType_RequestRoute && (
        <RequestRoute visible={visible} />
      )}
      {modalType === constants.modalType_AddInspector && (
        <AddInspector visible={visible} />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  visible: state.modal.visible,
  modalType: state.modal.modalType,
});

export default connect(mapStateToProps, {})(ModalContainer);
