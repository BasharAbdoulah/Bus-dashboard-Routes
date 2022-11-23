import React, { useEffect, useState } from "react";
// components
import { Col, Row, List, Table, Avatar } from "antd";
import * as signalR from "@microsoft/signalr";
// hooks
import useFetch from "hooks/useFetch";
import { Pie } from "@ant-design/plots";
// styles
import style from "../../views/Home/style.module.css";
import { FaRoute } from "react-icons/fa";
import queryString from "query-string";

import { connect } from "react-redux";
import axios from "axios";
const ListPaymentByCompany = ({ token }) => {
  const [connection, setConnection] = useState(null);
  const [connectionId, setConnectionId] = useState("");
  const [countPaymentToday, setCountPaymentToday] = useState(0);
  const [totalPaymentToday, setTotalPaymentToday] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [countPayment, setCountPayment] = useState(0);

  const [paymentLiveBus, setPaymentLiveBus] = useState([]);
  const { id, name } = queryString.parse(window.location.search);

  // count of route

  const {
    data = {},
    error,
    loading,
    executeFetch,
  } = useFetch(
    "https://route.click68.com/api/ListPaymentWalletByBusCompany",
    "post",
    { id, PageSize: 1000 },
    true,
    {},
    token
  );

  useEffect(() => {
    if (data?.status === true) {
      setPaymentLiveBus(data?.description);
      setTotalPaymentToday(data?.totalPaymentToday);
      setCountPaymentToday(data?.countPaymentToday);
      setTotalPayment(data?.totalPayment);
      setCountPayment(data?.countPayment);
    } else {
    }
  }, [data, error, loading]);

  useEffect(() => {
    const protocol = new signalR.JsonHubProtocol();
    const transport = signalR.HttpTransportType.WebSockets;

    const options = {
      transport,
      logMessageContent: true,
      logger: signalR.LogLevel.Trace,
      accessTokenFactory: () => token,
    };

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(
        process.env.REACT_APP_API_HOST + "chathub",
        options /*{ jwtBearer: token }*/
      )
      .withHubProtocol(protocol)
      .build();
    setConnection(newConnection);
    return () => {};
  }, []);

  useEffect(() => {
    // window.addEventListener("click", overlayClick);
    if (connection) {
      if (!connection.connectionStarted) {
        connection
          .start()
          .then((result) => {
            connection.on("RecieveConnectionId", (id) => {
              setConnectionId(id);
            });

            connection.on("PaymentLiveBus", (data) => {
              console.log(data);
              if (data?.companyID === id) {
                // setPaymentLiveBus({ item: data, loaded: true });
                setPaymentLiveBus((prev) => {
                  let arr = prev;
                  arr = [data, ...arr];
                  console.log("new arr", arr);
                  return [...arr];
                });
                setTotalPaymentToday((prev) => {
                  const num = prev;
                  const sum = parseFloat(data?.value) + num;
                  console.log("sum");
                  console.log(sum);
                  return sum;
                });
                setCountPayment((prev) => {
                  const num = prev;
                  const sum = 1 + num;
                  console.log("sum");
                  console.log(sum);
                  return sum;
                });
                setCountPaymentToday((prev) => {
                  const num = prev;
                  const sum = 1 + num;
                  console.log("sum");
                  console.log(sum);
                  return sum;
                });
                setTotalPayment((prev) => {
                  const num = prev;
                  const sum = parseFloat(data?.value) + num;
                  console.log("sum");
                  console.log(sum);
                  return sum;
                });
                console.log("sfdsfsdffg");
                console.log(data);

                parseInt(data?.totalPayment + paymentLiveBus.value);
                parseInt(data?.countPaymentToday + 1);
                parseInt(data?.totalPaymentToday + paymentLiveBus.value);
                parseInt(data?.countPayment + 1);
                console.log("paymentLiveBus.item");
                console.log(paymentLiveBus.item);
                console.log(paymentLiveBus.item);
              }
            });
          })
          .catch((err) => alert("Failed To Connect"));
      }
    }
    // else {
    //   console.log("remove event listener");
    //   window.removeEventListener("click", overlayClick);
    // }
  }, [connection]);
  const columns = [
    {
      title: "User ",
      dataIndex: "userName",
      key: "id",
    },

    {
      title: "Route",
      dataIndex: "routeName",
      key: "id",
    },
    {
      title: "Palte Number",
      dataIndex: "palteNumber",
      key: "id",
    },
    {
      title: "Value ",
      dataIndex: "value",
      key: "id",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "id",
    },
  ];
  return (
    <div>
      <Row gap={10}>
        <Col
          span={24}
          style={{
            margin: "10px",
          }}
        >
          <h3>
            Company :{""}
            {""}
            {name}
          </h3>
        </Col>
        <Col
          span={6}
          style={{
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
            display: "flex",
            alignItems: "center",
            flex: "column",
            justifyContent: "center",
            padding: "10px",
          }}
        >
          <h4>Payment : </h4> {""}
          <h4>{countPayment}</h4>
        </Col>
        <Col
          span={6}
          style={{
            boxShadow:
              " rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
            display: "flex",
            alignItems: "center",
            flex: "column",
            justifyContent: "center",
          }}
        >
          {" "}
          <h4>Today Payment :</h4>
          <h4>{countPaymentToday}</h4>
        </Col>
        <Col
          span={6}
          style={{
            boxShadow:
              " rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
            display: "flex",
            alignItems: "center",
            flex: "column",
            justifyContent: "center",
          }}
        >
          {" "}
          <h4>total Payment : </h4>
          <h4>{totalPayment.toFixed(3)}</h4>
        </Col>
        <Col
          span={6}
          style={{
            boxShadow:
              " rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
            display: "flex",
            alignItems: "center",
            flex: "column",
            justifyContent: "center",
          }}
        >
          {" "}
          <h4>total Payment Today : </h4>
          <h4>{totalPaymentToday.toFixed(3)}</h4>
        </Col>
      </Row>
      <br />
      <Table
        columns={columns}
        dataSource={paymentLiveBus}
        loading={loading}
        size="middle"
        rowKey={"id"}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  token: state.auth.token,
});

export default connect(mapStateToProps, {})(ListPaymentByCompany);
