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
const AddBus = ({
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
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_ADD_BUS,
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
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_GET_BUS,
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
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_EDIT_BUS,
    "post",
    {},
    false
  );
  // route data
  const {
    data: routedata,
    error: routeerror,
    loading: routeloading,
    executeFetch: routeexecuteFetch,
  } = useFetch(
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_LIST_ROUTE,
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
  //

  const handleFormOnFinish = async () => {
    console.log("submit");
    await form.validateFields();
    if (editMode) {
      editExecuteFetch({
        id: editId,
        companyID: form.getFieldValue("companyID"),
        Kind: form.getFieldValue("Kind"),
        PalteNumber: form.getFieldValue("PalteNumber"),
        RouteID: form.getFieldValue("RouteID"),
        SocondID: form.getFieldValue("SocondID"),
      });
    } else {
      executeFetch({
        companyID: form.getFieldValue("companyID"),
        SocondID: form.getFieldValue("SocondID"),
        Kind: form.getFieldValue("Kind"),
        PalteNumber: form.getFieldValue("PalteNumber"),
        RouteID: form.getFieldValue("RouteID"),
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
        companyID: getData.description.companyID,
        SocondID: getData.description.socondID,
        Kind: getData.description.kind,
        PalteNumber: getData.description.palteNumber,
        RouteID: getData.description.routeID,
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
      title="Add Bus"
      okButtonProps={{
        onClick: handleFormOnFinish,
        loading: loading || editLoading,
      }}
      destroyOnClose={true}
    >
      <Form form={form}>
        {getLoading ? (
          <h2>Loading......</h2>
        ) : (
          <React.Fragment>
            {error && <Alert description={error} type="error" />}

            <Row>
              <Col span={24}>
                <Form.Item
                  name="RouteID"
                  label="select route"
                  rules={[
                    {
                      required: true,
                      message: "pls",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select a route"
                    optionFilterProp="children"
                    // onChange={onChange}
                    onFocus={() => {
                      if (routedata?.description?.length > 0) return false;
                      routeexecuteFetch({ PageNumber: 1, PageSize: 60 });
                    }}
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {editMode && getData?.description?.routeID && (
                      <Option value={getData?.description?.routeID}>
                        {getData?.description?.routeName}
                      </Option>
                    )}

                    {routedata?.description?.length > 0 &&
                      routedata.description.map((item) => {
                        if (item.id === getData?.description?.routeID)
                          return false;

                        return <Option value={item.id}>{item.name}</Option>;
                      })}
                  </Select>
                </Form.Item>
              </Col>
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
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
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

                        return (
                          <Option value={item.id}>{item.companyName}</Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item name="SocondID" label="Adding SocondID">
                  <Input placeholder="Add SocondID" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="Kind"
                  label="Adding kind"
                  rules={[
                    {
                      required: true,
                      message: "Add kind",
                    },
                  ]}
                >
                  <Input placeholder="Add kind" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="PalteNumber"
                  label="Adding palte Number"
                  rules={[
                    {
                      required: true,
                      message: "Add palte Number",
                    },
                  ]}
                >
                  <Input placeholder="Add palte Number" />
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
export default connect(mapStateToProps, { closeModal })(AddBus);
