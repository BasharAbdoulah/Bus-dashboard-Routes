import React, { useMemo, useEffect, useState } from "react";
import { connect } from "react-redux";
import { openModal } from "redux/modal/action";
import * as constants from "redux/modal/constants";
import {
  Button,
  Table,
  Row,
  Col,
  Form,
  Select,
  Space,
  message,
  Modal,
} from "antd";
import useFetch from "hooks/useFetch";
import { DeleteOutlined, EditOutlined, WarningFilled } from "@ant-design/icons";
const { Option } = Select;
const RouteStation = ({ openModal }) => {
  const onSearch = (value) => console.log(value);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [form] = Form.useForm();
  // for table data
  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch(
    `${process.env.REACT_APP_API_HOST}api/ListRouteStation`,
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

  useEffect(() => {
    if (data?.status === true && !loading) {
      // {
      //   page: ,
      //   data: [],
      // }

      let found = false;
      for (let i = 0; i < tableData.length; i++) {
        if (tableData[i].page === currentPage) {
          found = true;
          break;
        }
      }

      if (found === false) {
        setTableData((prev) => {
          let newData = prev;
          newData.push({
            page: currentPage,
            data: data?.description,
          });
          return [...newData];
        });
      }
    }
  }, [data, error, loading]);

  //delete action
  const {
    data: deleteData = {},
    error: deleteError,
    loading: deleteLoading,
    executeFetch: deleteExecuteFetch,
  } = useFetch(
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_DELETE_ROUTE_STATION,
    "post",
    {},
    false
  );
  useEffect(() => {
    if (deleteData?.status === true) {
      // refresh the table ..
      message.success("Station has been deleted successfully !");
      executeFetch();
    } else if (deleteData?.status === false || deleteError) {
      Modal.info({
        title: "Something went wrong!",
        content: (
          <p>
            Some error happend while trying to delete this station. Please try
            again later.
          </p>
        ),
        icon: <WarningFilled style={{ color: "orange" }} />,
      });
    }
  }, [deleteData, deleteError, deleteLoading]);

  // handle delete item
  const handleDeleteItem = (id) => {
    Modal.confirm({
      title: "Are you sure about delete this station !",
      content: <div>this station will be deleted forever !.</div>,
      onOk() {
        deleteExecuteFetch({ id });
      },
    });
  };
  // handle edit item
  const handleEditItem = (id) => {
    openModal(constants.modalType_AddRouteStation, executeFetch, { id }, true);
  };

  useEffect(() => {
    if (data?.status === true && !loading) {
      // {
      //   page: ,
      //   data: [],
      // }
      let found = false;
      for (let i = 0; i < tableData.length; i++) {
        if (tableData[i].page === currentPage) {
          found = true;
          break;
        }
      }

      if (found === false) {
        setTableData((prev) => {
          let newData = prev;
          newData.push({
            page: currentPage,
            data: data?.description,
          });
          return [...newData];
        });
      }
    }
  }, [data, error, loading]);

  // table columns
  const columns = [
    // {
    //   title: "Area",
    //   dataIndex: "area",
    //   key: "area",
    // },
    {
      title: "Direction",
      dataIndex: "direction",
      key: "direction",
      render: (data) => {
        if (data == 0) return "Go";
        else if (data == 1) return "Back";
      },
    },

    {
      title: "Help Station",
      dataIndex: "helpStation",
      key: "helpStation",
      render: (data) => {
        if (data == false) return "False";
        else if (data == true) return "True";
      },
    },
    {
      title: "Route",
      dataIndex: "name_Route",
      key: "name_Route",
    },
    {
      title: "Order",
      dataIndex: "order",
      key: "order",
    },
    {
      title: "Station",
      dataIndex: "title_Station",
      key: "title_Station",
    },

    {
      title: "Actions",
      dataIndex: "id",
      key: "id",
      render: (data) => {
        return (
          <Space size="large" key={data}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleDeleteItem(data);
              }}
            >
              <DeleteOutlined />
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleEditItem(data);
              }}
            >
              <EditOutlined />
            </a>
          </Space>
        );
      },
    },
  ];
  useEffect(() => {
    const isFound = tableData.find((d) => d.page === currentPage);
    if (!isFound) {
      const filterID = form.getFieldValue("RouteID");
      let obj = { PageNumber: currentPage };
      if (filterID) {
        obj.id = filterID;
      }
      executeFetch(obj);
    }
  }, [currentPage]);

  let tab_data = tableData.find((i) => i.page === currentPage);

  return (
    <div>
      <Form form={form} layout="vertical">
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="RouteID">
              <Select
                showSearch
                placeholder="Select a route"
                optionFilterProp="children"
                allowClear
                // onChange={onChange}
                onFocus={() => {
                  if (routedata?.description?.length > 0) return false;
                  routeexecuteFetch({ PageNumber: 1, PageSize: 60 });
                }}
                onSearch={onSearch}
                filterOption={(input, option) =>
                  option.children
                    .toLowerCase()
                    .indexOf(input.toLocaleLowerCase()) > 0
                }
                onChange={(value) => {
                  // Will Be Like This
                  setTableData([]);
                  if (value) {
                    // filter with route id
                    executeFetch({ id: value });
                  } else {
                    // no filter (all)
                    executeFetch({});
                  }
                  // executeFetchByroute({ id: value });
                }}
              >
                {routedata?.description.map((item) => {
                  // if (item.id === getData?.description?.routeId )
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Button
              onClick={() => {
                openModal(constants.modalType_AddRouteStation, executeFetch);
              }}
            >
              Add Route Station
            </Button>
          </Col>
        </Row>
      </Form>

      <Table
        columns={columns}
        rowKey={"id"}
        pagination={{
          onChange: (page) => {
            setCurrentPage(page);
          },
          total: data?.total,
          current: currentPage,
        }}
        dataSource={tab_data?.data}
        loading={loading}
        size={"middle"}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { openModal })(RouteStation);
// rowKey={"id"}
// pagination={{
//   onChange: (page) => {
//     setCurrentPage(page);
//   },
//   total: data?.total,
//   current: currentPage,
// }}
