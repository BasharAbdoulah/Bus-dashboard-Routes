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
  const dataSource = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
  ];

  const columns2 = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
  ];

  return (
    <div>
      <Table
        columns={columns2}
        rowKey={"id"}
        pagination={{
          onChange: (page) => {
            setCurrentPage(page);
          },
          total: tableData?.length,
          current: currentPage,
        }}
        dataSource={dataSource}
        loading={loading}
        error={error}
        size={"middle"}
      />
    </div>
  );
}

export default SubscripionsDetails;
