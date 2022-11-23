import React, { useEffect, useState } from "react";
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
import { connect, useSelector } from "react-redux";
//redux action
import { openModal } from "redux/modal/action";
import * as constants from "redux/modal/constants";
import axios from "axios";

const Promoter = ({ openModal }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allData, setAllData] = useState({ tableData: [], total: 0 });
  const user = useSelector((state) => state.auth);
  // for table data
  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch("https://route.click68.com/api/WalletPromoter", "post", true);

  useEffect(async () => {
    await axios
      .post(
        "https://route.click68.com/api/WalletPromoter",
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

  console.log(data);

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
export default connect(mapStateToProps, { openModal })(Promoter);
