import React, { useEffect, useState } from "react";
//component
import { Link } from "react-router-dom";

import { Form, Space, Dropdown, Menu, Table, message, Modal } from "antd";
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
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
const Users = () => {
  const onSearch = (value) => console.log(value);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState([]);
  const history = useHistory();
  const search = history.location.search;
  const states = useSelector((state) => state.auth);
  const [rerender, setrerender] = useState(false);

  const idFromPathName = search.substring(
    search.indexOf("=") + 1,
    search.indexOf("&")
  );
  console.log(idFromPathName);
  useEffect(() => {
    console.log("state", states.token);
    console.log("history", history.location.search);
  }, [history.location.search]);

  console.log("render");

  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch("https://route.click68.com/api/ListUser", "post", {}, true);

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

  const {
    data: disActiveData = {},
    error: disActiveError,
    loading: disActiveLoading,
    executeFetch: disActiveExecuteFetch,
  } = useFetch(
    "https://route.click68.com/api/DeactivateUserByAdmin",
    "post",
    {},
    false
  );

  const {
    data: activeData = {},
    error: activeError,
    loading: activeLoading,
    executeFetch: activeExecuteFetch,
  } = useFetch(
    "https://route.click68.com/api/ActivateUserByAdmin",
    "post",
    {},
    false
  );

  useEffect(() => {
    if (activeData?.status === true) {
      message.success("activate !");
      executeFetch();
    } else if (activeData?.status === false || activeError) {
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
  }, [activeData, activeError, activeLoading]);

  const handleActive = (id) => {
    Modal.confirm({
      title: "Activate user",
      content: <div>activate user</div>,
      onOk() {
        activeExecuteFetch({ id });
      },
    });
  };

  useEffect(() => {
    if (disActiveData?.status === true) {
      // refresh the table ..
      message.success("disactive !");
      executeFetch();
    } else if (disActiveData?.status === false || disActiveError) {
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
  }, [disActiveData, disActiveError, disActiveLoading]);

  const handleDisActive = (id) => {
    Modal.confirm({
      title: "disactivate user",
      content: <div>disactivate user</div>,
      onOk() {
        disActiveExecuteFetch({ id });
      },
    });
  };

  const Actions = ({ data }) => {
    const menu = (
      <Menu>
        <Menu.Item key="1">
          <Link
            to={`/PaymentUser?id=${data.id}&name=${data.userName}&phone=${data.phone}`}
          >
            Payments
          </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link
            to={`/TripUser?id=${data.id}&name=${data.userName}&phone=${data.phone}`}
          >
            Trips
          </Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link
            to={`/ChargingUser?id=${data.id}&name=${data.userName}&phone=${data.phone}`}
          >
            Chargings
          </Link>
        </Menu.Item>
        <Menu.Item key="4">
          <Link
            to={`/Users?id=${data.id}&name=${data.userName}&phone=${data.phone}`}
          >
            Delete
          </Link>
        </Menu.Item>
      </Menu>
    );
    return (
      <Space size="large">
        <Dropdown overlay={menu} trigger={["click"]}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              Actions
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </Space>
    );
  };

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
      title: "Wallet",
      dataIndex: "phone",
      key: "Wallet",
    },

    {
      title: "State",
      dataIndex: "id",
      key: "id",
      render: (data, allData) => {
        return (
          <Space size="large" key={data}>
            {allData?.lockoutEnabled === true ? (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleActive(data);
                }}
              >
                <LockOutlined />
              </a>
            ) : (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleDisActive(data);
                }}
              >
                <UnlockOutlined />
              </a>
            )}
          </Space>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "",
      key: "id",
      render: (data) => {
        return <Actions data={data} />;
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
        size="small"
      />
    </div>
  );
};
export default Users;
