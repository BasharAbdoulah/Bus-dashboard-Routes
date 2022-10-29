import React, { useEffect, useState ,useRef } from "react";
import { useDownloadExcel } from 'react-export-table-to-excel';
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { CSVLink } from "react-csv";
import { Table } from "ant-table-extensions";
import {
  Form,
  Input,
  Modal,
  message,
  Space,
 
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
  const [data1, setData1] = useState([]);
  const fileName = "myfile"; // here enter filename for your excel file

  const [value, setValue] = useState("");
  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch(
    "https://route.click68.com/api/ListBus",
    "get",
    {PageSize: 1000 },
    true,
    {},
    token
  );
  useEffect(() => {
    if (data?.status === true && !loading) {
      setData1(data?.description);
     
    }
  }, [data, error, loading]);
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
  const fileType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";

const exportToCSV = (data1, fileName) => {
  const ws = XLSX.utils.json_to_sheet(data1);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(data, fileName + fileExtension);
};
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
        size="small"
        exportable
      />
    </div>
  );
};
const mapStateToProps = (state) => ({
  token: state.auth.token,
});
export default connect(mapStateToProps, { openModal })(Bus);
