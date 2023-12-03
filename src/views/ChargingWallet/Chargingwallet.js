import React, { useEffect, useState } from "react";
//component
import { Row, Col, Input, Checkbox, Form, Select, Alert } from "antd";
import { Table } from "ant-table-extensions";
import useFetch from "hooks/useFetch";
const { Option } = Select;

const Chargingwallet = () => {
  const onSearch = (value) => console.log(value);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState([]);

  const [form] = Form.useForm();
  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch(
    `${process.env.REACT_APP_API_HOST}api/ListChrgingWallet`,
    "post",
    {},
    true
  );
  useEffect(() => {
    if (data?.status === true && !loading) {
      // {
      //   page: ,
      //   data: [],
      // }
      let found = false;
      for (let i = 0; i < tableData.length; i++) {
        if (tableData[i].page === currentPage) {
          found = true;
          break;
        }
      }

      if (found === false) {
        setTableData((prev) => {
          let newData = prev;
          newData.push({
            page: currentPage,
            data: data?.description,
          });
          return [...newData];
        });
      }
    }
  }, [data, error, loading]);

  // const {
  //   data: dataByRoute = {},
  //   error: errorByroute,
  //   loading: loadingByroute,
  //   executeFetch: executeFetchByroute,
  // } = useFetch(
  //   "${process.env.REACT_APP_API_HOST}api/ListPaymentWalletByRouyeID",
  //   "post",
  //   {},
  //   true
  // );

  const {
    data: dataByUser = {},
    error: errorByUser,
    loading: loadingByUser,
    executeFetch: executeFetchByuserId,
  } = useFetch(
    `${process.env.REACT_APP_API_HOST}api/ListChrgingWalletByUserID`,
    "post",
    {},
    true
  );
  console.log("data");
  console.log(data);
  // const {
  //   data: routedata,
  //   error: routeError,
  //   loading: routeloading,
  //   executeFetch: routeexecuteFetch,
  // } = useFetch(
  //   process.env.REACT_APP_API_HOST + process.env.REACT_APP_LIST_ROUTE,
  //   "get",
  //   {},
  //   false
  // );
  const {
    data: userData = {},
    error: userError,
    loading: userLoading,
    executeFetch: executeFetchByuser,
  } = useFetch(`${process.env.REACT_APP_API_HOST}api/ListUser`, "post", {}, true);

  const columns = [
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "payment Gateway",
      dataIndex: "paymentGateway",
      key: "paymentGateway",
    },
    {
      title: "invoiceId ",
      dataIndex: "invoiceId",
      key: "invoiceId",
    },
    {
      title: "value ",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "date",
      dataIndex: "date",
      key: "date",
      render: (data) => {
        if (data.length > 20)
          return (
            <React.Fragment key={data}>
              {data.substring(0, 10)} {data.substring(11, 16)}{" "}
            </React.Fragment>
          );
      },
    },
  ];
  console.log("formmmm");
  console.log(form.getFieldsValue("UserID"));
  useEffect(() => {
    let isFound = tableData.find((d) => d.page === currentPage);
    if (!isFound) executeFetch({ PageNumber: currentPage });
  }, [currentPage]);

  let tab_data = tableData.find((i) => i.page === currentPage);

  return (
    <div>
      <Form form={form} layout="vertical">
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="UserID" label="select User">
              <Select
                showSearch
                placeholder="Select a user"
                optionFilterProp="children"
                allowClear
                // onChange={onChange}
                onFocus={() => {
                  if (userData?.description?.length > 0) return false;
                  executeFetchByuser();
                }}
                onSearch={onSearch}
                filterOption={(input, option) =>
                  option.children
                    .toLowerCase()
                    .indexOf(input.toLocaleLowerCase()) > 0
                }
                onChange={(value) => {
                  executeFetchByuserId({ id: value });
                }}
              >
                {userData?.description.map((item) => {
                  // if (item.id === getData?.description?.routeId )
                  return <Option value={item.id}>{item.userName}</Option>;
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Table
          columns={columns}
          rowKey={"id"}
          pagination={{
            onChange: (page) => {
              setCurrentPage(page);
            },
            total: data?.total,
            current: currentPage,
          }}
          dataSource={
            form.getFieldValue("UserID")
              ? dataByUser?.description
              : tab_data?.data
          }
          loading={loading || userLoading}
          exportable
        />
      </Form>
    </div>
  );
};

export default Chargingwallet;
