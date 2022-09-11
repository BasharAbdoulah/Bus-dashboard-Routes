import React, { useEffect, useState } from "react";
//components
import { Modal, Row, Col, Input, Form, Select, Alert } from "antd";

//redux
import { connect } from "react-redux";
//redux action
import { closeModal } from "redux/modal/action";
//hooks
import useFetch from "hooks/useFetch";
const { Option } = Select;
const AddStation = ({
  visible,
  closeModal,
  successAction,
  editMode,
  mPayloads,
}) => {
  const [form] = Form.useForm();
  const [editId, setEditId] = useState(null);
  const { data, error, loading, executeFetch } = useFetch(
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_ADD_STATION,
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
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_EDIT_STATION,
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
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_GET_STATION,
    "post",
    { ...mPayloads },
    editMode
  );

  const handleFormOnFinish = async () => {
    console.log("submit");
    await form.validateFields(); // if there is an error will return false

    if (editMode) {
      editExecuteFetch({
        id: editId,
        Title_EN: form.getFieldValue("Title_EN"),
        Title_AR: form.getFieldValue("Title_AR"),
        Longitude: form.getFieldValue("Longitude"),
        Latitude: form.getFieldValue("Latitude"),
        DirectionStation: parseInt(form.getFieldValue("DirectionStation")),
      });
    } else {
      executeFetch({
        Title_EN: form.getFieldValue("Title_EN"),
        Title_AR: form.getFieldValue("Title_AR"),
        Longitude: form.getFieldValue("Longitude"),
        Latitude: form.getFieldValue("Latitude"),
        DirectionStation: parseInt(form.getFieldValue("DirectionStation")),
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

  //useeffect for get data
  useEffect(() => {
    if (getData?.status === true) {
      form.setFieldsValue({
        Title_EN: getData.description.title_EN,
        Title_AR: getData.description.title_AR,
        Longitude: getData.description.longitude,
        Latitude: getData.description.latitude,
        DirectionStation: getData.description.direction,
      });
      setEditId(getData.description.id);
    }
  }, [getError, getData, getLoading]);
  // function onChange(value) {
  //   console.log(`selected ${value}`);
  // }

  //useeffect for edit submit
  useEffect(() => {
    if (editData?.status === true) {
      successAction();
      closeModal();
    }
  }, [editData, editError, editLoading]);

  // function onSearch(val) {
  //   console.log("search:", val);
  // }
  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  return (
    <Modal
      visible={visible}
      onCancel={closeModal}
      title="Add station"
      okButtonProps={{
        onClick: handleFormOnFinish,
        loading: loading || editLoading,
      }}
    >
      <Form form={form} layout="vertical">
        {getLoading ? (
          <h2>Loading.... </h2>
        ) : (
          <React.Fragment>
            {error && <Alert description={error} type="error" />}
            <Row>
              <Col span={24}>
                <Form.Item
                  name="Title_EN"
                  label="Add station arabic"
                  rules={[
                    {
                      required: true,
                      message: "Add station Name english",
                    },
                  ]}
                >
                  <Input placeholder="add station" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="Title_AR"
                  label="Add station arabic"
                  rules={[
                    {
                      required: false,
                      message: "Add station Name arabic ",
                    },
                  ]}
                >
                  <Input placeholder="add station" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="Latitude"
                  label="Add Latitude"
                  rules={[
                    {
                      required: true,
                      message: "Add Latitude ",
                    },
                  ]}
                >
                  <Input placeholder="add Latitude" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="Longitude"
                  label="Add Longitude"
                  rules={[
                    {
                      required: true,
                      message: "Add Longitude ",
                    },
                  ]}
                >
                  <Input placeholder="add Longitude" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="DirectionStation"
                  label="Add Direction"
                  rules={[
                    {
                      required: true,
                      message: "Add Direction",
                    },
                  ]}
                >
                  <Select onChange={handleChange}>
                    <Option value={0}>Right</Option>
                    <Option value={1}>Left</Option>
                  </Select>
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
export default connect(mapStateToProps, { closeModal })(AddStation);
