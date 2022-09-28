import React, { useEffect } from "react";
// components
import {
  Form,
  Input,
  Space,
  Button,
  Table,
  Modal,
  message,
  Menu,
  Dropdown,
} from "antd";
//component
import { Link } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
// hooks
import useFetch from "hooks/useFetch";
//redux
import { connect } from "react-redux";
//redux action
import { openModal } from "redux/modal/action";
import * as constants from "redux/modal/constants";

const Promoter = ({ openModal }) => {
  // for table data
  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch(
    "https://route.click68.com/api/ListPromoter",
    "post",

    true
  );

  const Actions = ({ data }) => {
    const menu = (
      <Menu>
        <Menu.Item key="1">
          <Link to={`/PromoterCharge?id=${data.id}`}>PromoterCharge</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to={`/PromoterStatistic?id=${data.id}`}>PromoterStatistic</Link>
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

  //handle edit item
  const handleEditItem = (id) => {
    openModal(constants.modalType_AddRole, executeFetch, { id }, true);
  };
  // table columns
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
      dataIndex: "userName",
      key: "id",
    },
    {
      title: "Phone number",
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
          openModal(constants.modalType_AddPromoter, executeFetch);
        }}
      >
        Add Promoter
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
export default connect(mapStateToProps, { openModal })(Promoter);
