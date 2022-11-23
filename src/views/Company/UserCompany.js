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
const UserCompany = ({ token, openModal }) => {
  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch(
    "https://route.click68.com/api/ListUserCompany",
    "post",
    {},
    true,
    {},
    token
  );
  console.log("data");
  console.log(data);
  const {
    data: deleteData = {},
    error: deleteError,
    loading: deleteLoading,
    executeFetch: deleteExecuteFetch,
  } = useFetch(
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_DELETE_USER_COMPANY,
    "post",
    {},
    false
  );

  useEffect(() => {
    if (deleteData?.status === true) {
      message.success("User has been deleted");
      executeFetch();
    } else if (deleteData?.status === false || deleteError) {
      Modal.info({
        title: "something went wrong",
        content: (
          <p>
            Some error happend while trying to delete this role. Please try
            again later.
          </p>
        ),
        icon: <WarningOutlined style={{ color: "red" }} />,
      });
    }
  }, [deleteData, deleteError, deleteLoading]);

  //handle  delete item
  const handleDeleteItem = (id) => {
    Modal.confirm({
      title: "are you about sure about deleting this user",
      content: <div>this user will be delete</div>,
      onOk() {
        deleteExecuteFetch({ id });
      },
    });
  };

  // handle edit item
  const handleEditItem = (id) => {
    openModal(constants.modalType_AddUserCompany, executeFetch, { id }, true);
  };

  const columns = [
    {
      title: "Company",
      dataIndex: "company",
      key: "id",
    },
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
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "id",
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
          </Space>
        );
      },
    },
  ];
  return (
    <div>
      <Row>
        <Col>
          <div>
            <Space>
              <Button
                style={{ backgrounColor: "#blue" }}
                onClick={() => {
                  openModal(constants.modalType_AddUserCompany, executeFetch);
                }}
              >
                Add User Company
              </Button>
            </Space>
          </div>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={data?.description}
        loading={loading}
        size="middle"
      />
    </div>
  );
};
const mapStateToProps = (state) => ({
  token: state.auth.token,
});
export default connect(mapStateToProps, { openModal })(UserCompany);
