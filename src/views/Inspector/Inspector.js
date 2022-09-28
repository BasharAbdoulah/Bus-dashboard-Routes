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
import { connect } from "react-redux";
const Inspector = ({ openModal }) => {
  //data table
  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch("https://route.click68.com/api/ListInspector", "post", {}, true);
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
      dataIndex: "userName",
      key: "id",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "id",
    },
    {
      title: "Wallet",
      dataIndex: "email",
      key: "id",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
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
      <Table
        columns={columns}
        dataSource={data?.description}
        loading={loading}
        size="small"
      />
    </div>
  );
};

const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, { openModal })(Inspector);
