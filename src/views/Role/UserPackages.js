import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import querySring from "query-string";
import useFetch from "hooks/useFetch";
import axios from "axios";
import { Table } from "antd";
import { useSelector } from "react-redux";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJOYW1lIjoiY29tcEtHTCIsIlJvbGUiOiJDb21wYW55IiwiZXhwIjoxNjY4NTk3OTQ0LCJpc3MiOiJJbnZlbnRvcnlBdXRoZW50aWNhdGlvblNlcnZlciIsImF1ZCI6IkludmVudG9yeVNlcnZpY2VQb3RtYW5DbGllbnQifQ.g--mk8XFDvHVxlsM8XW8xo0DhHH9yGqEbeLIhIfe5ak";
function UserPackages() {
  const [response, setResponse] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { id, name, phone } = querySring.parse(window.location.search);
  const user = useSelector((state) => state.auth);

  // api/ListPackageByUserIdForCompany
  useEffect(async () => {
    setLoading(true);
    await axios
      .post(
        `${process.env.REACT_APP_API_HOST}api/ListPackageByUserId`,
        {
          userId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      )
      .then((res) => {
        setResponse(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

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
      title: "Using Number",
      dataIndex: "usingNumber",
      key: "usingNumber",
    },
  ];

  return (
    <>
      <h4>{response?.name ? response?.name : "No"} packages : </h4>
      <Table
        columns={columns}
        rowKey={"id"}
        pagination={{
          onChange: (page) => {
            setCurrentPage(page);
          },
          total: response?.description.length,
          current: currentPage,
        }}
        dataSource={response?.description}
        loading={loading}
        error={""}
        size="middle"
      />
    </>
  );
}

export default UserPackages;
