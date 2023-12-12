import React, { useEffect, useState } from "react";
//component
import { Row, Col, Input, Checkbox, Form, Select, Alert } from "antd";
import { Table } from "ant-table-extensions";
import useFetch from "hooks/useFetch";
const { Option } = Select;

const Paymentwallet = () => {
  const onSearch = (value) => console.log(value);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [tableData, setTableData] = useState([]);

  const [form] = Form.useForm();
  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch(
    `${process.env.REACT_APP_API_HOST}api/ListPaymentWallet`,
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

  const {
    data: dataByRoute = {},
    error: errorByroute,
    loading: loadingByroute,
    executeFetch: executeFetchByroute,
  } = useFetch(
    `${process.env.REACT_APP_API_HOST}api/ListPaymentWalletByRouyeID`,
    "post",
    {},
    true
  );

  const {
    data: dataByUser = {},
    error: errorByUser,
    loading: loadingByUser,
    executeFetch: executeFetchByuserId,
  } = useFetch(
    `${process.env.REACT_APP_API_HOST}api/ListPaymentWalletByUserID`,
    "post",
    {},
    true
  );
  console.log("data");
  console.log(data);
  const {
    data: routedata,
    error: routeError,
    loading: routeloading,
    executeFetch: routeexecuteFetch,
  } = useFetch(
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_LIST_ROUTE,
    "post",
    {},
    false
  );
  const {
    data: userData = {},
    error: userError,
    loading: userLoading,
    executeFetch: executeFetchByuser,
  } = useFetch(`${process.env.REACT_APP_API_HOST}api/ListUser`, "post", {}, true);

  const {
    data: PPackagesData = {},
    error: PPackagesError,
    loading: PPackagesLoading,
    executeFetch: PPackagesExecute,
  } = useFetch(
    `${process.env.REACT_APP_API_HOST}api/PaymentByPackage`,
    "post",
    {},
    true
  );

  console.log(PPackagesData);

  const columns = [
    {
      title: "User Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Route",
      dataIndex: "routeName",
      key: "routeName",
    },
    {
      title: "value",
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

  // "id": "f70cc0e2-f838-4641-9c69-86bdea4ecaad",
  // "total": "0.000",
  // "userID": "b692c12c-c4ba-4cee-b092-ac3cb276dd38",
  // "user": null,
  // "email": null,
  // "name": null,
  // "paymentCode": "khaled n638047628251068748",
  // "payment_Date": "2022-11-23T01:14:09.2647086",
  // "route": null,
  // "description": "Paymaent By Package 2c18f4c8-cca0-4a07-5f94-08daccc5015a"

  const columns2 = [
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Payment Code",
      dataIndex: "paymentCode",
      key: "paymentCode",
    },
    {
      title: "Route",
      dataIndex: "route",
      key: "route",
    },
    {
      title: "description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Payment Date",
      dataIndex: "payment_Date",
      key: "payment_Date",
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

  useEffect(() => {
    let isFound = tableData.find((d) => d.page === currentPage);
    if (!isFound) executeFetch({ PageNumber: currentPage });
  }, [currentPage]);
  useEffect(() => {
    executeFetch({ PageNumber: currentPage });
  }, [currentPage2]);

  let tab_data = tableData.find((i) => i.page === currentPage);

  return (
    <div>
      <h2>Payments</h2>
      <Form style={{ minHeight: "668px" }} form={form} layout="vertical">
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="RouteID" label="select route">
              <Select
                showSearch
                placeholder="Select a route"
                optionFilterProp="children"
                allowClear
                // onChange={onChange}
                onFocus={() => {
                  if (routedata?.description?.length > 0) return false;
                  routeexecuteFetch({
                    PageNumber: 1,
                    PageSize: 60,
                  });
                }}
                onSearch={onSearch}
                filterOption={(input, option) =>
                  option.children
                    .toLowerCase()
                    .indexOf(input.toLocaleLowerCase()) > 0
                }
                onChange={(value) => {
                  executeFetchByroute({ id: value });
                }}
              >
                {routedata?.description.map((item) => {
                  return <Option value={item.id}>{item.name}</Option>;
                })}
              </Select>
            </Form.Item>
          </Col>
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
            form.getFieldValue("RouteID")
              ? dataByRoute?.description
              : form.getFieldValue("UserID")
              ? dataByUser?.description
              : tab_data?.data
          }
          loading={loading}
          size="middle"
        />
      </Form>

      <div className="packages-payments">
        <h3>Payments By Packages</h3>
        <h4>Payments Total: {PPackagesData?.description?.count}</h4>
        <Table
          columns={columns2}
          rowKey={"id"}
          pagination={{
            onChange: (page) => {
              setCurrentPage(page);
            },
            total: PPackagesData?.description?.count,
            current: currentPage2,
          }}
          dataSource={PPackagesData?.description?.list}
          loading={PPackagesLoading}
          size="middle"
        />
      </div>
    </div>
  );
};

export default Paymentwallet;
