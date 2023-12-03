import React, { useEffect, useState } from "react";

// components
import { Input, Table, Row, Col } from "antd";
// hooks
import useFetch from "hooks/useFetch";

//quary-string
import querySring from "query-string";
const { Search } = Input;
const ListPaymentUser = () => {
  const onSearch = (value) => console.log(value);
  const { id, name, phone } = querySring.parse(window.location.search);

  // for table data
  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch(
    `${process.env.REACT_APP_API_HOST}api/ListPaymentUser`,
    "post",
    { id, PageSize: 1000 },

    true
  );

  // table columns
  const columns = [
    {
      title: "Route",
      dataIndex: "route",
      key: "id",
    },

    {
      title: "Date",
      dataIndex: "payment_Date",
      key: "id",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "id",
    },
  ];

  return (
    <div>
      <Row>
        <Row
          gutter={24}
          style={{
            boxShadow:
              " rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
            display: "flex",
            alignItems: "center",
            flex: "column",
            justifyContent: "center",
            padding: "5px",
            margin: "5px",
          }}
        >
          <Col span={24}>
            <h4>User :{name}</h4>{" "}
          </Col>
          <Col span={24}>
            {" "}
            <h4>Phone Number: {name}</h4>{" "}
          </Col>
        </Row>
        <Col
          span={6}
          style={{
            boxShadow:
              " rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
            display: "flex",
            alignItems: "center",
            flex: "column",
            justifyContent: "center",
            padding: "5px",
            margin: "5px",
          }}
        >
          <h4> Sum Payments : {data?.sumPayment.toFixed(2)}</h4>
        </Col>
        <Col
          span={6}
          style={{
            boxShadow:
              " rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
            display: "flex",
            alignItems: "center",
            flex: "column",
            justifyContent: "center",
            padding: "5px",
            margin: "5px",
          }}
        >
          <h4> Count Payments : {data?.countPayment}</h4>
        </Col>
      </Row>
      <Table
        columns={columns}
        rowKey={"id"}
        dataSource={data?.description}
        loading={loading}
        size="middle"
      />
    </div>
  );
};

export default ListPaymentUser;
