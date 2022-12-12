import React, { useEffect, useState } from "react";
//component
import { Link } from "react-router-dom";

import {
  Form,
  Space,
  Dropdown,
  Menu,
  Table,
  message,
  Modal,
  Input,
} from "antd";
import {
  LockOutlined,
  SearchOutlined,
  UnlockOutlined,
  WarningFilled,
} from "@ant-design/icons";
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
import axios from "axios";
const Users = () => {
  const onSearch = (value) => console.log(value);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState({ list: [], count: 0 });
  const [searchMode, setSearchMode] = useState(false);
  const history = useHistory();
  const search = history.location.search;
  const user = useSelector((state) => state.auth);
  const idFromPathName = search.substring(
    search.indexOf("=") + 1,
    search.indexOf("&")
  );

  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch("https://route.click68.com/api/WalletUser", "post", {}, true);

  console.log("pagenation", data);
  useEffect(async () => {
    setTableData({
      list: data?.description.list,
      count: data?.description.count,
    });
  }, [data, error, loading]);

  // useEffect(() => {
  //   if (data?.status === true && !loading) {
  //     // {
  //     //   page: ,
  //     //   data:serersefsdfs [],
  //     // }
  //     let found = false;
  //     for (let i = 0; i < tableData.length; i++) {
  //       if (tableData[i].page === currentPage) {
  //         found = true;
  //         break;
  //       }
  //     }

  //     if (found === false) {
  //       setTableData((prev) => {
  //         let newData = prev;
  //         newData.push({
  //           page: currentPage,
  //           data: data?.description,
  //         });
  //         return [...newData];
  //       });
  //     }
  //   }
  // }, [data, error, loading]);

  // Active user functions
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
          <Link to={`/UserPackages?id=${data.userID ? data.userID : data.id}`}>
            Packages
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
      dataIndex: "name",
      key: "userName",
    },
    {
      title: "email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone number",
      dataIndex: "user",
      key: "phoneNumber",
    },
    {
      title: "Wallet",
      dataIndex: "total",
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
  const columns2 = [
    {
      title: " Name",
      dataIndex: "name",
      key: "userName",
    },
    {
      title: "userName",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
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

  const handleSearch = async (e) => {
    if (e.target.value == "") {
      setSearchMode(false);
      executeFetch();
    } else {
      setSearchMode(true);
      await axios
        .post(
          `${process.env.REACT_APP_API_HOST}api/SearchByUser`,
          { keyword: e.target.value },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        )
        .then((res) => {
          console.log("search value", res.data);
          setTableData({
            list: res.data.description,
            count: 1,
          });
        })
        .catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    // let isFound = tableData.find((d) => d.page === currentPage);
    if (true) executeFetch({ PageNumber: currentPage });
  }, [currentPage]);

  return (
    <div>
      <h3>Users</h3>
      <div className="user-search">
        <div className="s-container">
          <Input placeholder="Search by phone..." onChange={handleSearch} />
          <SearchOutlined />
        </div>
      </div>
      <h4>Total Wallets: {data?.description?.sumTotal}</h4>
      <h4>Users Count: {data?.description?.count}</h4>
      <Table
        columns={searchMode ? columns2 : columns}
        rowKey={"id"}
        pagination={{
          onChange: (page) => {
            setCurrentPage(page);
          },
          total: tableData.count,
          current: currentPage,
        }}
        dataSource={tableData?.list}
        loading={loading}
        error={""}
        size="middle"
      />
    </div>
  );
};
export default Users;
