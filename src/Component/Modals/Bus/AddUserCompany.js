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
const AddUserCompany = ({
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
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_USER_COMPANY,
    "post",
    {},
    false
  );
  //get data to change
  const {
    data: getData,
    error: getError,
    loading: getLoading,
    executeFetch: getExecuteFecth,
  } = useFetch(
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_GET_USER_COMPANY,
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
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_EDIT_USER_COMPANY,
    "post",
    {},
    false
  );
  const {
    data: companydata,
    error: companyerror,
    loading: companyloading,
    executeFetch: companyexecuteFetch,
  } = useFetch(`${process.env.REACT_APP_API_HOST}api/ListCompany`, "post", {}, false);
  function onSearch(value) {
    console.log("search:", value);
  }
  function onSearch(value) {
    console.log("search:", value);
  }

  const handleFormOnFinish = async () => {
    console.log("submit");
    await form.validateFields();
    if (editMode) {
      editExecuteFetch({
        id: editId,
        CompanyID: form.getFieldValue("CompanyID"),
        UserName: form.getFieldValue("UserName"),
        Password: form.getFieldValue("Password"),
      });
    } else {
      executeFetch({
        CompanyID: form.getFieldValue("CompanyID"),
        UserName: form.getFieldValue("UserName"),
        Password: form.getFieldValue("Password"),
      });
    }
  };

  useEffect(() => {
    if (data?.status === true) {
      successAction();
      closeModal();
    } else {
    }
  }, [data, loading, error]);

  useEffect(() => {
    if (getData?.status === true) {
      form.setFieldsValue({
        CompanyID: getData.description.companyID,
        UserName: getData.description.userName,
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
      title="Add User"
      okButtonProps={{
        onClick: handleFormOnFinish,
        loading: loading,
      }}
    >
      <Form form={form} layout="vertical">
        <Row>
          <Col span={24}>
            <Form.Item
              name="CompanyID"
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
          {!editMode && (
            <>
              <Col span={24}>
                <Form.Item
                  name="UserName"
                  label="User Company"
                  rules={[
                    {
                      required: true,
                      message: "Add user",
                    },
                  ]}
                >
                  <Input placeholder="Add user" />
                </Form.Item>{" "}
              </Col>

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
            </>
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
export default connect(mapStateToProps, { closeModal })(AddUserCompany);
