import React, { useEffect, useState } from "react";
//components
import {
  Form,
  Switch,
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
import { LockOutlined, UnlockOutlined, WarningFilled } from "@ant-design/icons";

import { Link } from "react-router-dom";

// hooks
import useFetch from "hooks/useFetch";
//redux connect
import { connect } from "react-redux";
//redux  actions
import { openModal } from "redux/modal/action";
import * as constants from "redux/modal/constants";

const RequestRoute = ({ token, openModal }) => {
  const [value, setValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [multiId, setMultiId] = useState([]);
  // for table data
  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch(
    "https://route.click68.com/api/ListRouteRequest",
    "post",

    true
  );
  const {
    data: unreadData = {},
    error: unreadError,
    loading: unreadLoading,
    executeFetch: unreadExecuteFetch,
  } = useFetch(
    "https://route.click68.com/api/UnreadRouteRequest",
    "post",
    {},
    false
  );
  const {
    data: deleteData = {},
    error: deleteError,
    loading: deleteLoading,
    executeFetch: deleteExecuteFetch,
  } = useFetch(
    "https://route.click68.com/api/DeletMultiRouteRequest",
    "post",
    {},
    false
  );
  useEffect(() => {
    if (unreadData?.status === true) {
      message.success("Unread !");
      executeFetch();
    } else if (unreadData?.status === false || unreadError) {
      Modal.info({
        title: "Something went wrong!",
        content: (
          <p>
            Some error happend while trying to unread this request. Please try
            again later.
          </p>
        ),
        icon: <WarningFilled style={{ color: "orange" }} />,
      });
    }
  }, [unreadData, unreadError, unreadLoading]);

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
      message.success("Routes has been deleted");
      executeFetch();
    } else if (deleteData?.status === false || deleteError) {
      Modal.info({
        title: "something went wrong",
        content: (
          <p>
            Some error happend while trying to delete this routes. Please try
            again later.
          </p>
        ),
        icon: <WarningOutlined style={{ color: "red" }} />,
      });
    }
  }, [deleteData, deleteError, deleteLoading]);

  //handle  delete item
  const handleDeleteItem = (id) => {
    Modal.confirm({
      title: "are you sure about deleting this routes",
      content: <div>this routes will be delete</div>,
      onOk() {
        deleteExecuteFetch({ MultiID: multiId });
      },
    });
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log("selectedRows: ", selectedRows);
      let data = [];
      if (!selectedRows) {
        setMultiId([]);
        return;
      }
      selectedRows?.map((item) => {
        data.push(item.id);
        setMultiId(data);
      });
    },
  };
  // table columns
  const columns = [
    {
      title: "Company",
      dataIndex: "company",
      key: "id",
    },
    // {
    //   title: "Area",
    //   dataIndex: "area",
    //   key: "id",
    // },
    // {
    //   title: "Name",
    //   dataIndex: "name",
    //   key: "id",
    // },
    // {
    //   title: "Price",
    //   dataIndex: "price",
    //   key: "id",
    // },
    // {
    //   title: "Date",
    //   dataIndex: "date",
    //   key: "id",
    // },

    {
      title: "Actions",
      dataIndex: "",
      key: "id",
      render: (data) => {
        return (
          <Space size="large" key={data}>
            <Link to={`/RequestDetails?id=${data.id}`}>RequestDetails</Link>
            {data?.read === true ? (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleActive(data.id);
                }}
              >
                Unread
              </a>
            ) : (
              "read"
            )}
          </Space>
        );
      },
    },
  ];
  const handleActive = (id) => {
    Modal.confirm({
      title: " Unread request",
      content: <div>Unread request</div>,
      onOk() {
        unreadExecuteFetch({ id });
      },
    });
  };
  useEffect(() => {
    let isFound = tableData.find((d) => d.page === currentPage);
    if (!isFound) executeFetch({ PageNumber: currentPage });
  }, [currentPage]);

  let tab_data = tableData.find((i) => i.page === currentPage);

  return (
    <div>
      <Space>
        <Button disabled={multiId.length === 0} onClick={handleDeleteItem}>
          Delete Route Request
        </Button>
      </Space>
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
        rowSelection={{ ...rowSelection }}
        dataSource={tab_data?.data}
        loading={loading}
        size="middle"
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  token: state.auth.token,
});
export default connect(mapStateToProps, { openModal })(RequestRoute);
