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
const Driver = ({ token, openModal }) => {
  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch(
    "https://route.click68.com/api/ListDriver",
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
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_Delete_DRIVER,
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
    openModal(constants.modalType_AddDriver, executeFetch, { id }, true);
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
          openModal(constants.modalType_AddDriver, executeFetch);
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
export default connect(mapStateToProp, { openModal })(Driver);
