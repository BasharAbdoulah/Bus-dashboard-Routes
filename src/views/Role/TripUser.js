import React, { useState, useEffect } from "react";
// components
import { Input, Table, Row, Col } from "antd";
// hooks
import useFetch from "hooks/useFetch";

//quary-string
import querySring from "query-string";
const { Search } = Input;

const ListTripUser = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState([]);

  const onSearch = (value) => console.log(value);
  const { id, name, phone } = querySring.parse(window.location.search);

  // for table data
  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch(
    "https://route.click68.com/api/ListTripUser",
    "post",
    { id, PageSize: 1000 },

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

  // table columns
  const columns = [
    {
      title: "Route",
      dataIndex: "route",
      key: "id",
    },
    {
      title: "Start Station",
      dataIndex: "startStation",
      key: "id",
    },
    {
      title: "End Station",
      dataIndex: "endStation",
      key: "id",
    },
  ];
  useEffect(() => {
    let isFound = tableData.find((d) => d.page === currentPage);
    if (!isFound) executeFetch({ PageNumber: currentPage });
  }, [currentPage]);

  let tab_data = tableData.find((i) => i.page === currentPage);

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
          span={8}
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
          <h4> Count Trips : {data?.countTrip?.toFixed(2)}</h4>
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
        dataSource={tab_data?.data}
        loading={loading}
        size="small"
      />
    </div>
  );
};

export default ListTripUser;
