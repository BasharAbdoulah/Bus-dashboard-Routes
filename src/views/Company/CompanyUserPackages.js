import { Table } from "antd";
import useFetch from "hooks/useFetch";
import React, { useEffect, useState } from "react";
import querySring from "query-string";

function CompanyUserPackages() {
  const [currentPage, setCurrentPage] = useState(1);
  const { id } = querySring.parse(window.location.search);

  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch(
    `${process.env.REACT_APP_API_HOST}api/ListPackageByUserIdForCompany`,
    "post",
    {
      userId: id,
    },
    true
  );

  useEffect(() => {
    executeFetch({ PageNumber: currentPage });
  }, [currentPage]);

  const columns = [
    {
      title: "Using Number",
      dataIndex: "usingNumber",
      key: "usingNumber",
    },
    {
      title: "Package Kind",
      dataIndex: "packageKind",
      key: "packageKind",
    },
    {
      title: "The date of purchase",
      dataIndex: "thedateofpurchase",
      key: "thedateofpurchase",
    },
    {
      title: "Expiration Date",
      dataIndex: "expirationDate",
      key: "expirationDate",
    },
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
  ];
  return (
    <div>
      <h3>{data?.name ? data?.name : "No"} Packages</h3>
      <Table
        columns={columns}
        rowKey={"id"}
        pagination={{
          onChange: (page) => {
            setCurrentPage(page);
          },
          total: 1,
          current: currentPage,
        }}
        dataSource={data?.description}
        loading={loading}
        error={error}
        size={"middle"}
      />
    </div>
  );
}

export default CompanyUserPackages;
