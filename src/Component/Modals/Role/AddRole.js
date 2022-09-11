import React, { useState, useEffect } from "react";
//component
import { modal, Row, Col, Input, Form, Alert } from "antd";

//redux
import { connect } from "react-redux";
//redux action
import { closeModal } from "redux/modal/action";

//hooks
import useFetch from "hooks/useFetch";
import Modal from "antd/lib/modal/Modal";

const AddRole = ({
  visible,
  closeModal,
  successAction,
  editMode,
  mPayloads,
}) => {
  const [form] = Form.useForm();
  //states
  const [editId, setEditId] = useState(null);
  //for add role
  const { data, error, loading, executeFetch } = useFetch(
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_ADD_ROLE,
    "post",
    {},
    false
  );

  //for edit role by id

  //for edit role by id
  const {
    data: getData,
    error: getError,
    loading: getLoading,
    executeFetch: getExecuteFecth,
  } = useFetch(
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_GET_ROLE,
    "post",
    { ...mPayloads },
    editMode
  );

  // for edit role
  const {
    data: editData,
    error: editError,
    loading: editLoading,
    executeFetch: editExecuteFetch,
  } = useFetch(
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_EDIT_ROLE,
    "post",
    {},
    false
  );

  const handleFormOnFinish = async () => {
    await form.validateFields();
    if (editMode) {
      editExecuteFetch({
        id: editId,
        Role: form.getFieldValue("Role"),
      });
    } else {
      executeFetch({
        Role: form.getFieldValue("Role"),
      });
    }
  };
  //useEffect for add role
  useEffect(() => {
    if (data?.status === true) {
      successAction();
      closeModal();
    } else {
    }
  }, [data, loading, error]);

  //useEffect for getting data
  useEffect(() => {
    if (getData?.status === true) {
      form.setFieldsValue({
        Role: getData.description.name,
      });
      setEditId(getData.description.id);
    }
  }, [getData, getError, getLoading]);

  //useEffect for editting data
  useEffect(() => {
    if (editData?.status === true) {
      successAction();
      closeModal();
    }
  }, [editData, editError, editLoading]);

  return (
    <Modal
      visible={visible}
      onCancel={closeModal}
      title="Add Role"
      okButtonProps={{
        onClick: handleFormOnFinish,
        loading: loading || editLoading,
      }}
    >
      <Form form={form} layout="vertical">
        {getLoading ? (
          <h2>Loading.......</h2>
        ) : (
          <React.Fragment>
            {error && <Alert description={error} type="error" />}

            <Row>
              <Col span={24}>
                <Form.Item
                  name="Role"
                  label="Adding Role"
                  rules={[
                    {
                      required: true,
                      message: "Add Role",
                    },
                  ]}
                >
                  <Input placeholder="Add Role" />
                </Form.Item>
              </Col>
            </Row>
          </React.Fragment>
        )}
      </Form>
    </Modal>
  );
};
const mapStateToProps = (state) => ({
  successAction: state.modal.successAction,
  editMode: state.modal.editMode,
  mPayloads: state.modal.mPayloads,
});
export default connect(mapStateToProps, { closeModal })(AddRole);
