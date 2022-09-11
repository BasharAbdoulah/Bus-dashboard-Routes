import React, { useEffect, useState } from "react";
//components
import { Modal, Row, Col, Input, Checkbox, Form, Select, Alert } from "antd";
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
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_ADD_ROUTE_STATION,
    "post",
    {},
    false
  );
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
    data: stationdata,
    error: stationerror,
    loading: stationloading,
    executeFetch: stationexecuteFetch,
  } = useFetch(
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_LIST_STATION,
    "post",
    {},
    false
  );
  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  const {
    data: getData,
    error: getError,
    loading: getLoading,
    executeFetch: getExecuteFecth,
  } = useFetch(
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_GET_ROUTE_STATION,
    "post",
    { ...mPayloads },
    editMode
  );
  const {
    data: getLastData,
    error: getLastError,
    loading: getLastLoading,
    executeFetch: getLastExecuteFecth,
  } = useFetch(
    process.env.REACT_APP_API_HOST +
      process.env.REACT_APP_GET_LAST_ROUTE_STATION,
    "get",
    {},
    !editMode
  );

  const {
    data: getLastDataByRoute,
    error: getLastErrorByRoute,
    loading: getLastLoadingByRoute,
    executeFetch: getLastExecuteFecthByRoute,
  } = useFetch(
    process.env.REACT_APP_API_HOST +
      process.env.REACT_APP_GET_ROUTE_STATION_BY_ROUTE_ID,
    "post",
    {},
    false
  );

  const {
    data: editData,
    error: editError,
    loading: editLoading,
    executeFetch: editExecuteFetch,
  } = useFetch(
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_EDIT_ROUTE_STATION,
    "post",
    {},
    false
  );
  const handleFormOnFinish = async () => {
    console.log("submit");
    await form.validateFields(); // if there is an error will return false

    if (editMode) {
      editExecuteFetch({
        id: editId,
        Direction: parseInt(form.getFieldValue("Direction")),
        Order: form.getFieldValue("Order"),
        RouteID: form.getFieldValue("RouteID"),
        StationID: form.getFieldValue("StationID"),
        HelpStation: form.getFieldValue("HelpStation"),
      });
    } else {
      executeFetch({
        Direction: form.getFieldValue("Direction"),
        Order: form.getFieldValue("Order"),
        StationID: form.getFieldValue("StationID"),
        RouteID: form.getFieldValue("RouteID"),
        HelpStation: form.getFieldValue("HelpStation"),
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
  useEffect(() => {
    if (getLastDataByRoute?.status === true) {
      form.setFieldsValue({
        Order: parseInt(getLastDataByRoute.description.order) + 1,
        Direction: getLastDataByRoute.description.direction,
      });
    }
  }, [getLastDataByRoute, getLastErrorByRoute, getLastLoadingByRoute]);
  //useeffect for get data
  useEffect(() => {
    if (getData?.status === true) {
      form.setFieldsValue({
        RouteID: getData.description.routeId,
        StationID: getData.description.stationId,
        Order: getData.description.order,
        Direction: getData.description.direction,

        HelpStation: getData.description.HelpStation,
      });
      setEditId(getData.description.id);
    }
  }, [getError, getData, getLoading]);

  useEffect(() => {
    if (getLastData?.status === true) {
      form.setFieldsValue({
        RouteID: getLastData.description.routeId,
        Order: parseInt(getLastData.description.order) + 1,
        Direction: getLastData.description.direction,
      });
    }
  }, [getLastError, getLastData, getLastLoading]);

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

  function onSearch(value) {
    console.log("search:", value);
  }

  return (
    <Modal
      visible={visible}
      onCancel={closeModal}
      title="Add Route Station"
      okButtonProps={{
        onClick: handleFormOnFinish,
        loading: loading || editLoading,
      }}
      destroyOnClose={true}
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
                      routeexecuteFetch({ PageNumber: 1, PageSize: 65 });
                    }}
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={(value) => {
                      getLastExecuteFecthByRoute({ id: value });
                    }}
                  >
                    {editMode && getData?.description?.routeId && (
                      <Option value={getData?.description?.routeId}>
                        {getData?.description?.name_Route_EN}
                      </Option>
                    )}
                    {!editMode && getLastData?.description?.routeId && (
                      <Option value={getLastData?.description?.routeId}>
                        {getLastData?.description?.name_Route_EN}
                      </Option>
                    )}
                    {routedata?.description?.length > 0 &&
                      routedata.description.map((item) => {
                        // if (item.id === getData?.description?.routeId )
                        if (
                          item.id === getData?.description?.routeId ||
                          item.id === getLastData?.description.routeId
                        )
                          return false;

                        return <Option value={item.id}>{item.name}</Option>;
                      })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="StationID"
                  label="select station"
                  rules={[
                    {
                      required: true,
                      message: "pls Add Station",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select a station"
                    optionFilterProp="children"
                    // onChange={onChange}
                    onFocus={() => {
                      if (stationdata?.description?.length > 0) return false;
                      stationexecuteFetch({ PageNumber: 1, PageSize: 1000 });
                    }}
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {editMode && getData?.description?.stationId && (
                      <Option value={getData?.description?.stationId}>
                        {getData?.description?.title_Station_EN}
                      </Option>
                    )}
                    {stationdata?.description?.length > 0 &&
                      stationdata.description.map((item) => {
                        // if (item.id === getData?.description?.stationId)
                        if (item.id === getData?.description?.stationId)
                          return false;
                        return <Option value={item.id}>{item.title}</Option>;
                      })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="Direction"
                  label="Add Direction"
                  rules={[
                    {
                      required: true,
                      message: "Add Direction",
                    },
                  ]}
                >
                  <Select onChange={handleChange}>
                    <Option value={0}>Go</Option>
                    <Option value={1}>Back</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item valuePropName="checked" name="HelpStation">
                  <Checkbox>true</Checkbox>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="Order"
                  label="Add Order"
                  rules={[
                    {
                      required: true,
                      message: "Add Order ",
                    },
                  ]}
                >
                  <Input placeholder="order" />
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
