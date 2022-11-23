import React, { useEffect, useState } from "react";

// components
import { Input, Table, Row, Col } from "antd";
// hooks
import useFetch from "hooks/useFetch";

//quary-string
import querySring from "query-string";
const { Search } = Input;
const InspectorUser = () => {
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
    "https://route.click68.com/api/ListInspictionUserByInspectorID",
    "post",
    { id, PageSize: 100 },

    true
  );

  // table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "id",
    },

    {
      title: "Phone",
      dataIndex: "phone",
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

export default InspectorUser;
