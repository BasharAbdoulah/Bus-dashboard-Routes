import React, { useState, useEffect } from "react";
// components
import { Input, Table } from "antd";
// hooks
import useFetch from "hooks/useFetch";

//style
import style from "./style.module.css";
//quary-string
import querySring from "query-string";
const { Search } = Input;
const StationsForRoute = () => {
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
    "https://route.click68.com/api/ListStationByRouteID",
    "post",
    { id },

    false
  );
  console.log("data");
  console.log(data);
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
      title: "Direction",
      dataIndex: "direction",
      key: "direction",
      render: (data) => {
        if (data == 0) return "Go";
        else if (data == 1) return "Back";
      },
    },
    {
      title: "Latitude",
      dataIndex: "latitude",
      key: "latitude",
    },

    {
      title: "Longitude",
      dataIndex: "longitude",
      key: "longitude",
    },
    {
      title: "Order",
      dataIndex: "order",
      key: "order",
    },
    {
      title: "Station",
      dataIndex: "title_Station",
      key: "title_Station",
    },
  ];
  useEffect(() => {
    let isFound = tableData.find((d) => d.page === currentPage);
    if (!isFound) executeFetch({ PageNumber: currentPage });
  }, [currentPage]);

  let tab_data = tableData.find((i) => i.page === currentPage);

  return (
    <div>
      <div className={style.btn}>
        <Search
          placeholder="input search text"
          onSearch={onSearch}
          enterButton
        />
      </div>
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
        size={"middle"}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({});

export default StationsForRoute;
