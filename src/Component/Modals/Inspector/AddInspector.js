import React, { useEffect, useState } from "react";
//component
import { Modal, Row, Col, Input, Select, Form } from "antd";

//redux
import { closeModal } from "redux/modal/action";
import { connect } from "react-redux";
import useFetch from "hooks/useFetch";
import Password from "antd/lib/input/Password";
const { Option } = Select;

const AddInspector = ({
  closeModal,
  visible,
  successAction,
  mPayloads,
  editMode,
}) => {
  const [form] = Form.useForm();
  const [editId, setEditId] = useState(null);
  const { data, error, loading, executeFetch } = useFetch(
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_ADD_INSPECTOR,
    "post",
    {},
    false
  );

  function onSearch(value) {
    console.log("search:", value);
  }
  const handleFormOnFinish = async () => {
    await form.validateFields();

    executeFetch({
      UserName: form.getFieldValue("UserName"),
      Password: form.getFieldValue("Password"),
    });
  };
  useEffect(() => {
    if (data?.status === true) {
      successAction();
      closeModal();
    }
  }, [data, loading, error]);

  return (
    <Modal
      visible={visible}
      onCancel={closeModal}
      title="Add Inspector"
      okButtonProps={{
        onClick: handleFormOnFinish,
        loading: loading,
      }}
    >
      <Form form={form} layout="vertical">
        <Row>
          <Col span={24}>
            <Form.Item
              name="UserName"
              label="Inspector Name"
              rules={[
                {
                  required: true,
                  message: "Add Inspector name",
                },
              ]}
            >
              <Input placeholder="Inspector Name" />
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
export default connect(mapStateToProps, { closeModal })(AddInspector);
