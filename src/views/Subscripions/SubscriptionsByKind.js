import React, { useEffect, useState } from "react";
import querySring from "query-string";
import useFetch from "hooks/useFetch";
import { Table } from "antd";
function SubscripionsByKind() {
  const { id, name, phone } = querySring.parse(window.location.search);

  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [endpoint, setEndpoint] = useState("");

  useEffect(() => {
    switch (name) {
      case "3 Month Pass":
        setEndpoint("ListPackageForThreeMonthlySubscriber");
        break;
      case "Monthly Pass":
        setEndpoint("ListPackageForMonthlySubscriber");
        break;
      case "Weekly Pass":
        setEndpoint("ListPackageForWeeklySubscriber");
        break;
      case "Daily Pass":
        setEndpoint("ListPackageForDailySubscriber");
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    executeFetch();
  }, [endpoint]);

  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch(`https://route.click68.com/api/${endpoint}`, "post", {}, true);

  useEffect(async () => {
    setTableData(data?.description);
  }, [data, error, loading]);

  useEffect(() => {
    if (true) executeFetch({ PageNumber: currentPage });
  }, [currentPage]);

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
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Package Kind",
      dataIndex: "packageKind",
      key: "packageKind",
    },

    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Using Number",
      dataIndex: "usingNumber",
      key: "usingNumber",
    },
  ];
  return (
    <div>
      <h3>{name} subscriptions</h3>
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
        size="middle"
      />
    </div>
  );
}

export default SubscripionsByKind;
