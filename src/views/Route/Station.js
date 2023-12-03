import React, { useMemo, useState, useEffect } from "react";
import { connect } from "react-redux";
import { openModal } from "redux/modal/action";
import * as constants from "redux/modal/constants";
import { Form, Input, Button, Table, Tag, Space, message, Modal } from "antd";
import useFetch from "hooks/useFetch";
import { DeleteOutlined, EditOutlined, WarningFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";
const { Search } = Input;

const Station = ({ openModal }) => {
  const onSearch = (value) => console.log(value);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState([]);

  // for table data
  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch(`${process.env.REACT_APP_API_HOST}api/ListStation`, "post", {}, false);
  // for delete action
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
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_DELETE_STATION,
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
    openModal(constants.modalType_AddStation, executeFetch, { id }, true);
  };

  // table columns
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Latitude",
      dataIndex: "latitude",
      key: "latitude",
    },
    {
      title: "Logitude",
      dataIndex: "logitude",
      key: "logitude",
    },
    {
      title: "Direction",
      dataIndex: "direction",
      key: "direction",
      render: (data) => {
        if (data == 0) return "Right";
        else if (data == 1) return "Left";
      },
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
            <Link to={`/RouteForStation?id=${data}`}>Routes</Link>
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
      <Button
        onClick={() => {
          openModal(constants.modalType_AddStation, executeFetch);
        }}
      >
        Add Station
      </Button>

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
        error={error}
        size="middle"
      />
    </div>
  );
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { openModal })(Station);
