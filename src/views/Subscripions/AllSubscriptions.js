import { Table } from "antd";
import useFetch from "hooks/useFetch";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function AllSubscriptions() {
  const user = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState([]);

  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch(
    `${process.env.REACT_APP_API_HOST}api/ListPackageForAllKindSubscriber`,
    "post",
    true
  );

  useEffect(() => {
    // let isFound = tableData.find((d) => d.page === currentPage);
    if (true) executeFetch({ PageNumber: currentPage });
  }, [currentPage]);

  // seting the data
  useEffect(() => {
    setTableData(data?.description);
  }, [data, error, loading]);

  console.log(data);
  const columns = [
    {
      title: "Activation Date",
      dataIndex: "activationDate",
      key: "activationDate",
    },
    {
      title: "Activation Expiry Date",
      dataIndex: "activationExpiryDate",
      key: "activationExpiryDate",
    },
    {
      title: "duration",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Package Kind",
      dataIndex: "packageKind",
      key: "packageKind",
    },
    {
      title: "userName",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "usingNumber",
      dataIndex: "usingNumber",
      key: "usingNumber",
    },
  ];
  return (
    <div>
      {" "}
      <Table
        columns={columns}
        rowKey={"id"}
        pagination={{
          onChange: (page) => {
            setCurrentPage(page);
          },
          total: tableData?.length,
          current: currentPage,
        }}
        dataSource={tableData}
        loading={loading}
        error={error}
        size={"middle"}
      />
    </div>
  );
}

export default AllSubscriptions;
