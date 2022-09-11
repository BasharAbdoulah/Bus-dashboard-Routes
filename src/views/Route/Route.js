import React, { useEffect, useState } from "react";
// components
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Table,
  Tag,
  Space,
  message,
  Modal,
} from "antd";
import { DeleteOutlined, EditOutlined, WarningFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";
// redux
import { connect } from "react-redux";
// redux actions
import { openModal } from "redux/modal/action";
import * as constants from "redux/modal/constants";
// hooks
import useFetch from "hooks/useFetch";

//style
import style from "./style.module.css";
const Route = ({ openModal }) => {
  const onSearch = (value) => console.log(value);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState([]);

  // for table data
  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch("https://route.click68.com/api/ListRoute", "post", {}, false);
  // for delete action

  const {
    data: deleteData = {},
    error: deleteError,
    loading: deleteLoading,
    executeFetch: deleteExecuteFetch,
  } = useFetch(
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_DELETE_ROUTE,
    "post",
    {},
    false
  );

  // useEffects

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

  // useEffect for delete action
  useEffect(() => {
    if (deleteData?.status === true) {
      // refresh the table ..
      message.success("Route has been deleted successfully !");
      executeFetch();
    } else if (deleteData?.status === false || deleteError) {
      Modal.info({
        title: "Something went wrong!",
        content: (
          <p>
            Some error happend while trying to delete this route. Please try
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
      title: "Are you sure about delete this route !",
      content: <div>this route will be deleted forever !.</div>,
      onOk() {
        deleteExecuteFetch({ id });
      },
    });
  };

  // handle edit item
  const handleEditItem = (id) => {
    openModal(constants.modalType_AddRoute, executeFetch, { id }, true);
  };

  console.log("tableData __");
  console.log(tableData);

  // table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Area",
      dataIndex: "area",
      key: "area",
      render: (data) => {
        if (data.length > 100)
          return (
            <React.Fragment key={data}>{data.substring(0, 50)}</React.Fragment>
          );
      },
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
    },

    {
      title: "from_To",
      dataIndex: "from_To",
      key: "from_To",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },

    {
      title: "Actions",
      dataIndex: "",
      key: "id",
      render: (data) => {
        return (
          <Space size="large" key={data}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleDeleteItem(data.id);
              }}
            >
              <DeleteOutlined />
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleEditItem(data.id);
              }}
            >
              <EditOutlined />
            </a>
            <Link to={`/StationsForRoute?id=${data.id}`}>Stations</Link>
            <Link
              to={`/Map?id=${data.id}&name=${data.name}&from_To=${data.from_To}`}
            >
              Map
            </Link>
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
        <Col span={24}>
          <div className={style.btn}>
            <Button
              size="large"
              style={{ backgrounColor: "#blue" }}
              onClick={() => {
                openModal(constants.modalType_AddRoute, executeFetch);
              }}
            >
              Add Route
            </Button>
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
        dataSource={tab_data?.data}
        loading={loading}
        size="small"
      />
    </div>
  );
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { openModal })(Route);
