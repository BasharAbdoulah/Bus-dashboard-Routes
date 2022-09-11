import React, { useEffect, useState } from "react";
//component
import { Modal, Row, Col, Input, Select, Form } from "antd";

//redux
import { closeModal } from "redux/modal/action";
import { connect } from "react-redux";
import useFetch from "hooks/useFetch";
import Password from "antd/lib/input/Password";
const { Option } = Select;

const AddDriverCompany = ({
  closeModal,
  visible,
  successAction,
  mPayloads,
  editMode,
}) => {
  const [form] = Form.useForm();
  const [editId, setEditId] = useState(null);
  const { data, error, loading, executeFetch } = useFetch(
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_DRIVER_COMPANY,
    "post",
    {},
    false
  );
  const {
    data: getData,
    error: getError,
    loading: getLoading,
    executeFetch: getExecuteFecth,
  } = useFetch(
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_GET_DRIVER_COMPANY,
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
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_EDIT_DRIVER_COMPANY,
    "post",
    {},
    false
  );

  function onSearch(value) {
    console.log("search:", value);
  }
  const handleFormOnFinish = async () => {
    await form.validateFields();
    if (editMode) {
      editExecuteFetch({
        id: editId,
        userName: form.getFieldValue("userName"),
      });
    } else {
      executeFetch({
        userName: form.getFieldValue("userName"),
        Password: form.getFieldValue("Password"),
      });
    }
  };
  useEffect(() => {
    if (data?.status === true) {
      successAction();
      closeModal();
    }
  }, [data, loading, error]);
  useEffect(() => {
    if (getData?.status === true) {
      form.setFieldsValue({
        userName: getData.description.userName,
      });
      setEditId(getData.description.id);
    }
  }, [getData, getError, getLoading]);
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
      title="Add Driver"
      okButtonProps={{
        onClick: handleFormOnFinish,
        loading: loading,
      }}
    >
      <Form form={form} layout="vertical">
        <Row>
          <Col span={24}>
            <Form.Item
              name="userName"
              label="Driver"
              rules={[
                {
                  required: true,
                  message: "Add Driver",
                },
              ]}
            >
              <Input placeholder="Add Driver" />
            </Form.Item>{" "}
          </Col>
          {!editMode && (
            <Col span={24}>
              <Form.Item
                name="Password"
                label="password"
                rules={[
                  {
                    required: true,
                    message: "Add Password",
                  },
                ]}
              >
                <Input.Password placeholder="password" />
              </Form.Item>{" "}
            </Col>
          )}
        </Row>
      </Form>
    </Modal>
  );
};
const mapStateToProps = (state) => ({
  successAction: state.modal.successAction,
  editMode: state.modal.editMode,
  mPayloads: state.modal.mPayloads,
});
export default connect(mapStateToProps, { closeModal })(AddDriverCompany);
