import { Empty, Table } from "antd";
import useFetch from "hooks/useFetch";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function CompanyUsers() {
  const user = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState([]);

  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch(
    "https://route.click68.com/api/ListUserByCompanyId",
    "post",
    {
      id: user?.id,
      PageNumber: currentPage,
    },
    true
  );

  useEffect(() => {
    setTableData(data?.description);
  }, [data, error, loading]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Package number for this user",
      dataIndex: "packageNumberForThisUser",
      key: "packageNumberForThisUser",
    },
    {
      title: "userName",
      dataIndex: "userName",
      key: "userName",
    },
  ];
  return (
    <div>
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

export default CompanyUsers;
