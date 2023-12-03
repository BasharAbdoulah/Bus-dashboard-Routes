import React, { useEffect, useState } from "react";

// components
import { Input, Table, Row, Col } from "antd";
// hooks
import useFetch from "hooks/useFetch";

//quary-string
import querySring from "query-string";
const { Search } = Input;
const InspectorBus = () => {
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
    `${process.env.REACT_APP_API_HOST}api/ListInspictionBusByInspectorID`,
    "post",
    { id, PageSize: 100 },

    true
  );

  // table columns
  const columns = [
    {
      title: "Company",
      dataIndex: "company",
      key: "id",
    },

    {
      title: "Kind",
      dataIndex: "kind",
      key: "id",
    },
    {
      title: "palte Number",
      dataIndex: "palteNumber",
      key: "id",
    },
    {
      title: "Route",
      dataIndex: "route",
      key: "id",
    },
  ];

  return (
    <div>
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

export default InspectorBus;
