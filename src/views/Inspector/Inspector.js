import React, { useEffect, useState } from "react";
//components
import { Form, Space, Dropdown, Menu, Button, Table } from "antd";
import { Link } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
//hooks
import useFetch from "hooks/useFetch";
//redux
import { openModal } from "redux/modal/action";
import * as constants from "redux/modal/constants";
import { connect, useSelector } from "react-redux";
import axios from "axios";
const Inspector = ({ openModal }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allData, setAllData] = useState({ tableData: [], total: 0 });
  const user = useSelector((state) => state.auth);
  //data table

  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch(
    `${process.env.REACT_APP_API_HOST}api/WalletInspector`,
    "post",
    {},
    true
  );

  useEffect(async () => {
    await axios
      .post(
        `${process.env.REACT_APP_API_HOST}api/WalletInspector`,
        {
          PageNumber: currentPage,
        },
        {
          headers: {
            Authorization: `bearer ${user.token}`,
          },
        }
      )
      .then((result) => {
        console.log(result);
        if (result?.data.status) {
          setAllData({
            tableData: result.data.description.list,
            total: result.data.description.sumTotal,
          });
        }
      });
  }, []);

  const Actions = ({ data }) => {
    const menu = (
      <Menu>
        <Menu.Item key="1">
          <Link to={`/InspectorBus?id=${data.id}`}>Bus</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to={`/InspectorUser?id=${data.id}`}>User</Link>
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
      title: "Name",
      dataIndex: "name",
      key: "id",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "id",
    },
    {
      title: "Wallet",
      dataIndex: "total",
      key: "id",
    },
    {
      title: "Phone",
      dataIndex: "user",
      key: "id",
    },
    {
      title: "Actions",
      dataIndex: "",
      key: "id",
      render: (data) => {
        return <Actions data={data} />;
      },
    },
  ];
  return (
    <div>
      <Button
        onClick={() => {
          openModal(constants.modalType_AddInspector, executeFetch);
        }}
      >
        Add Inpector
      </Button>
      <h4 className="total-title">
        Total Wallets: <strong>{allData?.total}</strong>
      </h4>
      <Table
        columns={columns}
        dataSource={allData?.tableData}
        loading={loading}
        size="middle"
        pagination={{
          onChange: (page) => {
            setCurrentPage(page);
          },
          total: allData?.tableData.length,
          current: currentPage,
        }}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, { openModal })(Inspector);
