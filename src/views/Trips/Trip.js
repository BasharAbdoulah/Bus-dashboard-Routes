import React, { useState, useEffect } from "react";
//component
import { Form, Input, Column } from "antd";
import useFetch from "hooks/useFetch";

import { Table } from "ant-table-extensions";
const Trips = () => {
  const onSearch = (value) => console.log(value);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState([]);

  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch("https://route.click68.com/api/ListTrip", "post");

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

  console.log("data");
  console.log(data);
  //table colums
  const columns = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Start Station",
      dataIndex: "startStation",
      key: "startStation",
    },
    {
      title: "End Station",
      dataIndex: "endStation",
      key: "endStation",
    },
    {
      title: "Route ",
      dataIndex: "rout",
      key: "rout",
    },
  ];
  useEffect(() => {
    let isFound = tableData.find((d) => d.page === currentPage);
    if (!isFound) executeFetch({ PageNumber: currentPage });
  }, [currentPage]);

  let tab_data = tableData.find((i) => i.page === currentPage);

  return (
    <div>
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
        error={error}
        size="small"
        exportable
      />
    </div>
  );
};
export default Trips;
