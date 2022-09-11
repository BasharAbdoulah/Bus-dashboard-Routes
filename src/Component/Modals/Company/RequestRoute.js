import React from "react";
//component
import { Modal, Form, Row, Col, Input, Alert, Select } from "antd";
//redux
import { connect } from "react-redux";
//redux action
import { closeModal } from "redux/modal/action";

//hooks
import useFetch from "hooks/useFetch";
import { useState } from "react";
import { useEffect } from "react";
const { Option } = Select;
const AddBusCompany = ({
  visible,
  closeModal,
  successAction,
  editMode,
  mPayloads,
}) => {
  const [form] = Form.useForm();
  //states
  const [editId, setEditId] = useState(null);
  //for add bus
  const { data, error, loading, executeFetch } = useFetch(
    "https://route.click68.com/api/company/RequestRoute",

    "post",
    {},
    false
  );

  const handleFormOnFinish = async () => {
    console.log("submit");
    await form.validateFields();

    executeFetch({
      Name_EN: form.getFieldValue("Name_EN"),
      Name_AR: form.getFieldValue("Name_AR"),
      Area_EN: form.getFieldValue("Area_EN"),
      Area_AR: form.getFieldValue("Area_AR"),
      Price: form.getFieldValue("Price"),
    });
  };

  useEffect(() => {
    if (data?.status === true) {
      closeModal();
    } else {
    }
  }, [data, loading, error]);
  return (
    <Modal
      visible={visible}
      onCancel={closeModal}
      title="Send Request for adding new route"
      okButtonProps={{
        onClick: handleFormOnFinish,
        loading: loading,
      }}
      destroyOnClose={true}
    >
      <Form form={form}>
        <React.Fragment>
          {error && <Alert description={error} type="error" />}

          <Row>
            <Col span={24}>
              <Form.Item
                name="Name_EN"
                label="Adding Name EN"
                rules={[
                  {
                    required: true,
                    message: "Add Name_EN",
                  },
                ]}
              >
                <Input placeholder="Add Name EN" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="Name_AR"
                label="Adding Name AR"
                rules={[
                  {
                    required: true,
                    message: "Add Name AR",
                  },
                ]}
              >
                <Input placeholder="Add Name AR" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="Area_EN"
                label="Adding Area EN"
                rules={[
                  {
                    required: true,
                    message: "Add Area EN",
                  },
                ]}
              >
                <Input placeholder="Add Area EN" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="Area_AR"
                label="Adding Area AR"
                rules={[
                  {
                    required: true,
                    message: "Add Area_AR",
                  },
                ]}
              >
                <Input placeholder="Add Area AR" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="Price"
                label="Adding Price"
                rules={[
                  {
                    required: true,
                    message: "Add Price",
                  },
                ]}
              >
                <Input placeholder="Add Price" />
              </Form.Item>
            </Col>
          </Row>
        </React.Fragment>
      </Form>
    </Modal>
  );
};

const mapStateToProps = (state) => ({
  successAction: state.modal.successAction,

  mPayloads: state.modal.mPayloads,
});
export default connect(mapStateToProps, { closeModal })(AddBusCompany);
