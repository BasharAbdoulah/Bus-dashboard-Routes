import React, { useEffect, useState } from "react";
//component
import { Modal, Row, Col, Input, Select, Form } from "antd";

//redux
import { closeModal } from "redux/modal/action";
import { connect } from "react-redux";
import useFetch from "hooks/useFetch";
import Password from "antd/lib/input/Password";
const { Option } = Select;

const AddDriver = ({
  closeModal,
  visible,
  successAction,
  mPayloads,
  editMode,
}) => {
  const [form] = Form.useForm();
  const [editId, setEditId] = useState(null);
  const { data, error, loading, executeFetch } = useFetch(
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_ADD_DRIVER,
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
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_GET_DRIVER,
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
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_EDIT_DRIVER,
    "post",
    {},
    false
  );
  const {
    data: companydata,
    error: companyerror,
    loading: companyloading,
    executeFetch: companyexecuteFetch,
  } = useFetch("https://route.click68.com/api/ListCompany", "post", {}, false);

  function onSearch(value) {
    console.log("search:", value);
  }
  const handleFormOnFinish = async () => {
    await form.validateFields();
    if (editMode) {
      editExecuteFetch({
        id: editId,
        companyID: form.getFieldValue("companyID"),
        userName: form.getFieldValue("userName"),
      });
    } else {
      executeFetch({
        companyID: form.getFieldValue("companyID"),
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
        companyID: getData.description.companyID,
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
              name="companyID"
              label="Select Company"
              rules={[
                {
                  required: true,
                  message: "pls",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Select a company"
                optionFilterProp="children"
                onFocus={() => {
                  if (companydata?.description?.length > 0) return false;
                  companyexecuteFetch({ PageNumber: 1, PageSize: 60 });
                }}
                onSearch={onSearch}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {editMode && getData?.description?.companyID && (
                  <Option value={getData?.description?.companyID}>
                    {getData?.description?.company}
                  </Option>
                )}

                {companydata?.description?.length > 0 &&
                  companydata.description.map((item) => {
                    if (item.id === getData?.description?.companyID)
                      return false;

                    return <Option value={item.id}>{item.companyName}</Option>;
                  })}
              </Select>
            </Form.Item>
          </Col>
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
export default connect(mapStateToProps, { closeModal })(AddDriver);
