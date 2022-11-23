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

//hooks
import useFetch from "hooks/useFetch";
//redux connect
import { connect } from "react-redux";
//redux  actions
import { openModal } from "redux/modal/action";
import * as constants from "redux/modal/constants";
const Bus = ({ token, openModal }) => {
  const [value, setValue] = useState("");
  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch(
    "https://route.click68.com/api/ListBus",
    "get",
    {},
    true,
    {},
    token
  );
  const {
    data: activedata = {},
    error: activeError,
    loading: activeLoading,
    executeFetch: activeExecuteFetch,
  } = useFetch(
    "https://route.click68.com/api/ListBusActive",
    "post",
    {},
    true,
    {},
    token
  );
  const {
    data: unactivedata = {},
    error: unactiveerror,
    loading: unactiveloading,
    executeFetch: unactiveexecuteFetch,
  } = useFetch(
    "https://route.click68.com/api/ListBusNotActive",
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
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_DELETE_BUS,
    "post",
    {},
    false
  );

  useEffect(() => {
    if (deleteData?.status === true) {
      message.success("Bus has been deleted");
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

  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
    if (setValue === "Active") return activeExecuteFetch();
    else if (setValue === "unActive") return unactiveexecuteFetch();
  };

  //handle  delete item
  const handleDeleteItem = (id) => {
    Modal.confirm({
      title: "are you sure about deleting this bus",
      content: <div>this bus will be delete</div>,
      onOk() {
        deleteExecuteFetch({ id });
      },
    });
  };

  // handle edit item
  const handleEditItem = (id) => {
    openModal(constants.modalType_AddBus, executeFetch, { id }, true);
  };

  const columns = [
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
    },
    {
      title: "Kind",
      dataIndex: "kind",
      key: "kind",
    },
    {
      title: "palte number",
      dataIndex: "palteNumber",
      key: "palteNumber",
    },
    {
      title: "Route",
      dataIndex: "route",
      key: "route",
    },
    {
      title: "Actions",
      dataIndex: "id",
      key: "id",
      render: (data) => {
        return (
          <Space size="large" key={data}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleDeleteItem(data);
              }}
            >
              <DeleteOutlined />
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleEditItem(data);
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
                  openModal(constants.modalType_AddBus, executeFetch);
                }}
              >
                Add Bus For Company
              </Button>

              <Radio.Group
                defaultValue="Active"
                onChange={onChange}
                value={value}
                buttonStyle="solid"
              >
                <Radio.Button value="Active">Acitve Bus</Radio.Button>
                <Radio.Button value="unActive">Unactive Bus</Radio.Button>
              </Radio.Group>
            </Space>
          </div>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={
          value === "Active"
            ? activedata?.description
            : value === "unActive"
            ? unactivedata?.description
            : data?.description
        }
        loading={loading || activeLoading}
        size="middle"
      />
    </div>
  );
};
const mapStateToProps = (state) => ({
  token: state.auth.token,
});
export default connect(mapStateToProps, { openModal })(Bus);
