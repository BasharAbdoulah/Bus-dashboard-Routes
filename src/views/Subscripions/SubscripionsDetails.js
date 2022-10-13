import { Table } from "antd";
import useFetch from "hooks/useFetch";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function SubscripionsDetails() {
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState([]);

  const { subscriptionType } = useSelector((state) => state.modal);
  console.log("state", subscriptionType);

  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch(
    "https://route.click68.com/api/ListPaymentWallet",
    "post",
    {},
    true
  );

  useEffect(() => {
    // let isFound = tableData.find((d) => d.page === currentPage);
    if (true) executeFetch({ PageNumber: currentPage });
  }, [currentPage]);

  const columns = [
    {
      title: "User Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Expire date",
      dataIndex: "routeName",
      key: "routeName",
    },
    {
      title: "Subscription date",
      dataIndex: "date",
      key: "date",
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
      <strong>{subscriptionType}</strong>
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
        dataSource={data?.description}
        loading={loading}
        error={error}
        size="small"
      />
    </div>
  );
}

export default SubscripionsDetails;
