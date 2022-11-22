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
const Company = ({ token, openModal }) => {
  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch(
    "https://route.click68.com/api/ListCompany",
    "post",
    {},
    true,
    {},
    token
  );

  const {
    data: deleteData = {},
    error: deleteError,
    loading: deleteLoading,
    executeFetch: deleteExecuteFetch,
  } = useFetch(
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_DELETE_COMPANY,
    "post",
    {},
    false
  );

  useEffect(() => {
    if (deleteData?.status === true) {
      message.success("Company has been deleted");
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
      title: "are you about sure about deleting this company",
      content: <div>this company will be delete</div>,
      onOk() {
        deleteExecuteFetch({ id });
      },
    });
  };

  // handle edit item
  const handleEditItem = (id) => {
    openModal(constants.modalType_AddCompany, executeFetch, { id }, true);
  };

  const columns = [
    {
      title: "Company",
      dataIndex: "companyName",
      key: "company",
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

            <Link
              to={`/PaymentByCompany?id=${data.id}&name=${data.companyName}`}
            >
              List payment by company
            </Link>
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
                  openModal(constants.modalType_AddCompany, executeFetch);
                }}
              >
                Add Company
              </Button>
            </Space>
          </div>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={data?.description}
        loading={loading}
        size="small"
      />
    </div>
  );
};
const mapStateToProps = (state) => ({
  token: state.auth.token,
});
export default connect(mapStateToProps, { openModal })(Company);
