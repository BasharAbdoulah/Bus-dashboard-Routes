import React, { useEffect } from "react";
//hooks
import useFetch from "hooks/useFetch";
//component
import { Form, Input, Space, Button, Table, Modal, message } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  WarningOutlined,
} from "@ant-design/icons";
//redux action
import { openModal } from "redux/modal/action";
import * as constants from "redux/modal/constants";

//redux connect
import { connect } from "react-redux";

const DriverCompany = ({ token, openModal }) => {
  // for table data
  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch(
    "https://route.click68.com/api/company/DriverByCompany",
    "post",

    true
  );

  const {
    data: deleteData = {},
    error: deleteError,
    loading: deleteLoading,
    executeFetch: deleteExecuteFetch,
  } = useFetch(
    process.env.REACT_APP_API_HOST +
      process.env.REACT_APP_DELETE_DRIVER_COMPANY,
    "post",
    {},
    false
  );

  //useEffect for delete item
  useEffect(() => {
    if (deleteData?.status === true) {
      //refresh the table ....
      message.success("Driver has been deleted succeeefully !");
      executeFetch();
    } else if (deleteData?.status === false || deleteError) {
      Modal.info({
        title: "Something went wrong !",
        content: (
          <p>
            Some error happend while trying to delete this driver. Please try
            again later.
          </p>
        ),
        icon: <WarningOutlined style={{ color: "red" }} />,
      });
    }
  }, [deleteData, deleteError, deleteLoading]);

  //handle Delete item
  const handleDeleteItem = (id, name) => {
    Modal.confirm({
      title: "Are you sure about delete this driver",
      content: <div>this driver will be deleted forever.....!</div>,
      onOk() {
        deleteExecuteFetch({ id });
      },
    });
  };
  // handle edit item
  const handleEditItem = (id) => {
    openModal(constants.modalType_AddDriverCompany, executeFetch, { id }, true);
  };
  // table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
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
                handleDeleteItem(data.id, data.name);
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
      <Button
        onClick={() => {
          openModal(constants.modalType_AddDriverCompany, executeFetch);
        }}
      >
        Add Driver
      </Button>
      <Table
        columns={columns}
        dataSource={data?.description}
        loading={loading}
        size="middle"
      />
    </div>
  );
};

const mapStateToProp = (state) => ({
  token: state.auth.token,
});
export default connect(mapStateToProp, { openModal })(DriverCompany);
