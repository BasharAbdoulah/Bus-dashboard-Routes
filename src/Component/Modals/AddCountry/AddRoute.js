import React, { useEffect, useState } from "react";
// components
import { Modal, Row, Col, Input, Form, Alert } from "antd";
// redux
import { connect } from "react-redux";
// redux actions
import { closeModal } from "redux/modal/action";
// hooks
import useFetch from "hooks/useFetch";

const AddRoute = ({
  visible,
  closeModal,
  successAction,
  editMode,
  mPayloads,
}) => {
  const [form] = Form.useForm();
  // states
  const [editId, setEditId] = useState(null);
  // for add route
  const { data, error, loading, executeFetch } = useFetch(
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_ADD_ROUTE,
    "post",
    {},
    false
  );
  // for edit route
  const {
    data: editData,
    error: editError,
    loading: editLoading,
    executeFetch: editExecuteFetch,
  } = useFetch(
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_EDIT_ROUTE,
    "post",
    {},
    false
  );
  // for get route by id
  const {
    data: getData,
    error: getError,
    loading: getLoading,
    executeFetch: getExecuteFecth,
  } = useFetch(
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_GET_ROUTE,
    "post",
    { ...mPayloads },
    editMode
  );

  const handleFormOnFinish = async () => {
    await form.validateFields(); // if there is an error will return false
    if (editMode) {
      editExecuteFetch({
        id: editId,
        Name_AR: form.getFieldValue("Name_AR"),
        Name_EN: form.getFieldValue("Name_EN"),
        Area_EN: form.getFieldValue("Area_EN"),
        Area_AR: form.getFieldValue("Area_AR"),
        from_To_AR: form.getFieldValue("from_To_AR"),
        from_To_EN: form.getFieldValue("from_To_EN"),
        company: form.getFieldValue("company"),
        Price: form.getFieldValue("Price"),
      });
    } else {
      // no erorrs ..
      executeFetch({
        Name_AR: form.getFieldValue("Name_AR"),
        Name_EN: form.getFieldValue("Name_EN"),
        Area_EN: form.getFieldValue("Area_EN"),
        Area_AR: form.getFieldValue("Area_AR"),
        from_To_AR: form.getFieldValue("from_To_AR"),
        from_To_EN: form.getFieldValue("from_To_EN"),
        company: form.getFieldValue("company"),
        Price: form.getFieldValue("Price"),
      });
    }
  };

  useEffect(() => {
    if (data?.status === true) {
      successAction();
      closeModal();
      // refresh table
    } else {
    }
  }, [data, loading, error]);
  console.log("data");
  console.log(getData);
  useEffect(() => {
    if (getData?.status === true) {
      form.setFieldsValue({
        Name_AR: getData.description.name_AR,
        Name_EN: getData.description.name_EN,
        Area_AR: getData.description.area_AR,
        Area_EN: getData.description.area_EN,
        from_To_EN: getData.description.from_To_EN,
        from_To_AR: getData.description.from_To_AR,
        company: getData.description.company,
        Price: getData.description.price,
      });
      setEditId(getData.description.id);
    }
  }, [getData, getLoading, getError]);

  // useEffect for edit submit
  useEffect(() => {
    if (editData?.status === true) {
      successAction();
      closeModal();
    }
  }, [editData, editLoading, editError]);

  return (
    <Modal
      open={visible}
      onCancel={closeModal}
      title="Add Route"
      okButtonProps={{
        onClick: handleFormOnFinish,
        loading: loading || editLoading,
      }}
    >
      <Form form={form} layout="vertical">
        {getLoading ? (
          <h2>Loading ...</h2>
        ) : (
          <React.Fragment>
            {error && <Alert description={error} type="error" />}
            <Row>
              <Col span={24}>
                <Form.Item
                  name="Name_AR"
                  label="Add Route arabic"
                  rules={[
                    {
                      required: true,
                      message: "Add Route Name Arabic",
                    },
                  ]}
                >
                  <Input placeholder="add Route" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="Name_EN"
                  label="Add Route english"
                  rules={[
                    {
                      required: true,
                      message: "Add Route Name English",
                    },
                  ]}
                >
                  <Input placeholder="add Route" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="Area_AR"
                  label="Add Area arabic"
                  rules={[
                    {
                      required: true,
                      message: "Add area Name Arabic",
                    },
                  ]}
                >
                  <Input placeholder="add area" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="Area_EN"
                  label="Add Area english"
                  rules={[
                    {
                      required: true,
                      message: "Add area Name English",
                    },
                  ]}
                >
                  <Input placeholder="add area" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="from_To_AR"
                  label="From To"
                  rules={[
                    {
                      required: true,
                      message: "Add from to",
                    },
                  ]}
                >
                  <Input placeholder="From to" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="from_To_EN"
                  label="From to in english"
                  rules={[
                    {
                      required: true,
                      message: "Add from to",
                    },
                  ]}
                >
                  <Input placeholder="from to in english" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="company"
                  label="Add company name"
                  rules={[
                    {
                      required: true,
                      message: "pls add company",
                    },
                  ]}
                >
                  <Input placeholder="add company name" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="Price"
                  label="Add price"
                  rules={[
                    {
                      required: true,
                      message: "pls add price",
                    },
                  ]}
                >
                  <Input placeholder="add price" />
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

export default connect(mapStateToProps, { closeModal })(AddRoute);
