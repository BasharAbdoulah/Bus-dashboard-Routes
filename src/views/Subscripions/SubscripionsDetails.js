import { Table } from "antd";
import useFetch from "hooks/useFetch";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function SubscripionsDetails() {
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState([]);

  const { subscriptionType } = useSelector((state) => state.modal);

  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch(
    "https://route.click68.com/api/ListPackage",
    "post",
    {
      PageSize: 21,
    },
    true
  );

  useEffect(async () => {
    const packages = data?.description.filter(
      (packItem) => packItem.companyID === subscriptionType
    );
    setTableData(packages);
  }, [data, error, loading]);

  useEffect(() => {
    if (true) executeFetch({ PageNumber: currentPage });
  }, [currentPage]);

  const user = useSelector((state) => state.auth);

  const columns = [
    {
      title: "Company name",
      dataIndex: "companyName",
      key: "companyName",
    },
    {
      title: "Description",
      dataIndex: "desc",
      key: "desc",
    },
    {
      title: "Kind number",
      dataIndex: "kind",
      key: "kind",
    },
    {
      title: "Kind",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Create date",
      dataIndex: "create_Date",
      key: "create_Date",
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
        size="small"
      />
    </div>
  );
}

export default SubscripionsDetails;
