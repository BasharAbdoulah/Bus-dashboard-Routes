import React, { useEffect, useState } from "react";

// components
import { Input, Table, Row, Col } from "antd";
// hooks
import useFetch from "hooks/useFetch";

//quary-string
import querySring from "query-string";
const { Search } = Input;
const PromoterStatistic = () => {
  const onSearch = (value) => console.log(value);
  const { id } = querySring.parse(window.location.search);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState([]);

  // for table data
  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch(
    "https://route.click68.com/api/InstallByPrometorStstic",
    "post",
    { id },

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
      title: "Promoter",
      dataIndex: "promoter",
      key: "id",
    },

    {
      title: "User",
      dataIndex: "user",
      key: "id",
    },
    {
      title: "Date",
      dataIndex: "date",
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
        size="middle"
      />
    </div>
  );
};

export default PromoterStatistic;
