import React, { useEffect, useState } from "react";
//component
import { Link, useHistory } from "react-router-dom";

import {
  Form,
  Space,
  Dropdown,
  Menu,
  Table,
  message,
  Modal,
  Empty,
} from "antd";
import { LockOutlined, UnlockOutlined, WarningFilled } from "@ant-design/icons";
import {
  CameraOutlined,
  DeleteOutlined,
  EditOutlined,
  FilterFilled,
  FilterOutlined,
  DownOutlined,
} from "@ant-design/icons";
import useFetch from "hooks/useFetch";
import { useSelector } from "react-redux";
import axios from "axios";
const DeletedUsers = () => {
  const onSearch = (value) => console.log(value);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState([]);
  const history = useHistory();
  const pathName = history.location.pathname;
  const user = useSelector((state) => state.auth);
  const [loading, setLodaing] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);

  // const {
  //     data = [],
  //     error,
  //     loading,
  //     executeFetch,
  // } = useFetch("${process.env.REACT_APP_API_HOST}api/ListDeleteAccount", "post", {}, true);

  useEffect(async () => {
    await axios
      .post(
        `${process.env.REACT_APP_API_HOST}api/ListDeleteAccount`,
        {
          PageNumber: currentPage,
          id: user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        if (res.data.total > 0) {
          setTableData(res?.data?.description);
          setLodaing(false);
        } else {
          setIsEmpty(true);
          console.log("No deleted users!!");
        }
      });
  }, []);

  const columns = [
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "phone",
      dataIndex: "phone",
      key: "phone",
    },

    {
      title: "Delete date",
      dataIndex: "delete_Date",
      key: "id",
    },
  ];
  console.log(tableData);

  //   useEffect(() => {
  //     let isFound = tableData.find((d) => d.page === currentPage);
  //     if (!isFound) executeFetch({ PageNumber: currentPage });
  //   }, [currentPage]);

  //   let tab_data = tableData.find((i) => i.page === currentPage);

  return (
    <div>
      {isEmpty ? (
        <Empty />
      ) : (
        <Table
          columns={columns}
          rowKey={"id"}
          pagination={{
            onChange: (page) => {
              setCurrentPage(page);
            },
            total: tableData.length,
            current: currentPage,
          }}
          dataSource={tableData}
          loading={loading}
          size="middle"
        />
      )}
    </div>
  );
};
export default DeletedUsers;
