import React, { useEffect, useState } from "react";
//components
import {
  Form,
  Input,
  Modal,
  message,
  Space,
  Table,
  Col,
  Row,
  Button,
  Radio,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  WarningOutlined,
} from "@ant-design/icons";

// hooks
import useFetch from "hooks/useFetch";
//redux connect
import { connect } from "react-redux";
//redux  actions
import { openModal } from "redux/modal/action";
import * as constants from "redux/modal/constants";

const BusByCompany = ({ token, openModal }) => {
  const [value, setValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState([]);

  // for table data
  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch(
    "https://route.click68.com/api/company/ListBus",
    "post",

    true
  );
  const {
    data: activedata = {},
    error: activeError,
    loading: activeLoading,
    executeFetch: activeExecuteFetch,
  } = useFetch(
    "https://route.click68.com/api/company/ListBusActive",
    "post",
    {},
    true,
    {},
    token
  );
  const {
    data: unactivedata = {},
    error: unactiveerror,
    loading: unactiveloading,
    executeFetch: unactiveexecuteFetch,
  } = useFetch(
    "https://route.click68.com/api/company/ListBusNotActive",
    "post",
    {},
    true,
    {},
    token
  );

  const {
    data: deleteData = {},
    error: deleteError,
    loading: deleteLoading,
    executeFetch: deleteExecuteFetch,
  } = useFetch(
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_DELETE_BUS_COMPANY,
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

  useEffect(() => {
    if (deleteData?.status === true) {
      message.success("Bus has been deleted");
      executeFetch();
    } else if (deleteData?.status === false || deleteError) {
      Modal.info({
        title: "something went wrong",
        content: (
          <p>
            Some error happend while trying to delete this role. Please try
            again later.
          </p>
        ),
        icon: <WarningOutlined style={{ color: "red" }} />,
      });
    }
  }, [deleteData, deleteError, deleteLoading]);

  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
    if (setValue === "Active") return activeExecuteFetch();
    else if (setValue === "unActive") return unactiveexecuteFetch();
  };

  //handle  delete item
  const handleDeleteItem = (id) => {
    Modal.confirm({
      title: "are you sure about deleting this bus",
      content: <div>this bus will be delete</div>,
      onOk() {
        deleteExecuteFetch({ id });
      },
    });
  };

  // handle edit item
  const handleEditItem = (id) => {
    openModal(constants.modalType_AddBusCompany, executeFetch, { id }, true);
  };

  // table columns
  const columns = [
    {
      title: "Company",
      dataIndex: "company",
      key: "id",
    },
    {
      title: "Kind",
      dataIndex: "kind",
      key: "id",
    },
    {
      title: "route",
      dataIndex: "route",
      key: "id",
    },
    {
      title: "Palte Number",
      dataIndex: "palteNumber",
      key: "id",
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
    let isFound = tableData.find((d) => d.page === currentPage);
    if (!isFound) executeFetch({ PageNumber: currentPage });
  }, [currentPage]);

  let tab_data = tableData.find((i) => i.page === currentPage);

  return (
    <div>
      <Row>
        <Col>
          <div>
            <Space>
              <Button
                style={{ backgrounColor: "#blue" }}
                onClick={() => {
                  openModal(constants.modalType_AddBusCompany, executeFetch);
                }}
              >
                Add Bus
              </Button>

              <Radio.Group
                defaultValue="Active"
                onChange={onChange}
                value={value}
                buttonStyle="solid"
                style={{ marginRight: "20px" }}
              >
                <Radio.Button value="Active">Acitve Bus</Radio.Button>
                <Radio.Button value="unActive">Unactive Bus</Radio.Button>
              </Radio.Group>
            </Space>
          </div>
        </Col>
      </Row>
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
        dataSource={
          value === "Active"
            ? activedata?.description
            : value === "unActive"
            ? unactivedata?.description
            : tab_data?.data
        }
        loading={loading || activeLoading}
        size="small"
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  token: state.auth.token,
});
export default connect(mapStateToProps, { openModal })(BusByCompany);
