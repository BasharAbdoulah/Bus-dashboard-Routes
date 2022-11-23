import React, { useEffect, useState } from "react";
//components
import {
  Form,
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
import { Link } from "react-router-dom";

//hooks
import useFetch from "hooks/useFetch";
//redux connect
import { connect } from "react-redux";
//redux  actions
import { openModal } from "redux/modal/action";
import * as constants from "redux/modal/constants";
const BusCompany = ({ token, openModal }) => {
  const [value, setValue] = useState("");
  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch(
    "https://route.click68.com/api/ListBusCompany",
    "post",
    {},
    true,
    {},
    token
  );

  const columns = [
    {
      title: "Company",
      dataIndex: "company",
      key: "id",
    },

    {
      title: "Actions",
      dataIndex: "",
      key: "id",
      render: (data) => {
        return (
          <Space size="large" key={data}>
            <Link to={`/PaymentByCompany?name=${data.company}`}>
              List payment by company
            </Link>
          </Space>
        );
      },
    },
  ];
  return (
    <div>
      <Table
        columns={columns}
        dataSource={data?.description}
        loading={loading}
        size={"middle"}
      />
    </div>
  );
};
const mapStateToProps = (state) => ({
  token: state.auth.token,
});
export default connect(mapStateToProps, { openModal })(BusCompany);
