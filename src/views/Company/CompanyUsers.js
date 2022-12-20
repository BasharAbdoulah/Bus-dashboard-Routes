import { EditOutlined } from "@ant-design/icons";
import { Empty, Space, Table } from "antd";
import useFetch from "hooks/useFetch";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function CompanyUsers() {
  const user = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch(
    "https://route.click68.com/api/ListUserByCompanyId",
    "post",
    {
      id: "4fe6fa3d-87d3-4ac4-e93a-08da2b65d3ff",
      PageNumber: currentPage,
    },
    true
  );

  useEffect(() => {
    executeFetch({ PageNumber: currentPage });
  }, [currentPage]);

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
    {
      title: "Actions",
      dataIndex: "",
      key: "id",
      render: (data) => {
        return (
          <Space size="large" key={data}>
            <Link to={`/CompanyUserPackages?id=${data.userId}`}>Packages</Link>
          </Space>
        );
      },
    },
  ];
  return (
    <div>
      <h3>Total users: {data?.usertotal}</h3>
      <Table
        columns={columns}
        rowKey={"id"}
        pagination={{
          onChange: (page) => {
            setCurrentPage(page);
          },
          total: data?.usertotal,
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

export default CompanyUsers;
