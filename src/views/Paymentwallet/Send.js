import React, { useEffect, useState } from "react";
//component
import { Row, Col, Input, Checkbox, Form, Select, Alert, Empty } from "antd";
import { Table } from "ant-table-extensions";
import useFetch from "hooks/useFetch";
import { SearchOutlined } from "@ant-design/icons";
import axios, { Axios } from "axios";
import { useSelector } from "react-redux";
const { Option } = Select;

const Send = () => {
  const onSearch = (value) => console.log(value);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [paymentsList, setPaymentsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const user = useSelector((state) => state.auth);

  useEffect(async () => {
    await axios
      .post(
        "https://route.click68.com/api/ListCharcheAllSender",
        {
          PageNumber: currentPage,
          id: user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        if (res?.data.total > 0) {
          setPaymentsList(res.data.description);
          setIsLoading(false);
        } else {
          setIsEmpty(true);
          console.log(Error("No payments!!"));
        }
      })
      .catch((err) => {
        console.log(err);
        setIsEmpty(true);
      });
  }, [currentPage]);

  const columns = [
    {
      title: "Sender",
      dataIndex: "sender",
      key: "sender",
    },
    {
      title: "Reciver ",
      dataIndex: "reciver",
      key: "reciver",
    },
    {
      title: "value",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Payment date",
      dataIndex: "payment_Date",
      key: "payment_Date",

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

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <div>
      <h2>Send</h2>
      <Form layout="vertical">
        <Row gutter={24}>
          <div className="search-container">
            <Input
              placeholder="Search..."
              onChange={(e) => handleSearch(e)}
              value={searchValue}
            />
            <SearchOutlined className="search-icon" />
          </div>
        </Row>

        {isEmpty ? (
          <Empty />
        ) : (
          <Table
            columns={columns}
            rowKey={"id"}
            pagination={{
              onChange: (page) => {
                console.log(page);
                setCurrentPage(page);
              },
              total: paymentsList?.length,
              current: currentPage,
            }}
            dataSource={paymentsList}
            loading={isLoading}
            size="small"
            exportable
          />
        )}
      </Form>
    </div>
  );
};

export default Send;
