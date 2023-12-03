import React, { useEffect, useState } from "react";
// components
import { Col, Row, List, Table } from "antd";
import * as signalR from "@microsoft/signalr";
// hooks
import useFetch from "hooks/useFetch";
// styles
import queryString from "query-string";
import style from "../Home/style.module.css";
import { connect } from "react-redux";
const audio = new Audio("/sounds/pristine-609.mp3");

const PaymentCompany = ({ token, role, companyID }) => {
  const [connection, setConnection] = useState(null);
  const [connectionId, setConnectionId] = useState("");
  const [countPaymentToday, setCountPaymentToday] = useState(0);
  const [totalPaymentToday, setTotalPaymentToday] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [countPayment, setCountPayment] = useState(0);

  const [paymentLiveBus, setPaymentLiveBus] = useState([]);
  const { id, name } = queryString.parse(window.location.search);
  const [SumPaymenttCompany, setSumPaymenttCompany] = useState(0);
  const [CountPaymenttCompany, setCountPaymenttCompany] = useState(0);

  // count of route

  const {
    data = {},
    error,
    loading,
    executeFetch,
  } = useFetch(
    `${process.env.REACT_APP_API_HOST}api/company/PaymentByCompany`,
    "post",
    { PageSize: 1000 },
    true,
    {},
    token
  );

  const {
    data: sumpaymentCompanyData = {},
    error: sumpaymentCompanyError,
    loading: sumpaymentCompanyLoading,
    SumpaymentCompanyexecuteFetch,
  } = useFetch(
    `${process.env.REACT_APP_API_HOST}api/SumPaymentByCompany`,
    "get",
    {},
    role?.includes("Company") ? true : false,
    {},
    token
  );
  const {
    data: countpaymentCompany = {},
    error: countpaymentCompanyError,
    loading: countpaymentCompanyLoading,
    CountpaymentCompanyexecuteFetch,
  } = useFetch(
    `${process.env.REACT_APP_API_HOST}api/CountPaymentByCompany`,
    "get",
    {},
    role?.includes("Company") ? true : false,
    {},
    token
  );

  useEffect(() => {
    if (data?.status === true) {
      setPaymentLiveBus(data?.description);
    } else {
    }
  }, [data, error, loading]);
  useEffect(() => {
    if (sumpaymentCompanyData?.status === true) {
      setSumPaymenttCompany(sumpaymentCompanyData?.description?.count);
    } else {
    }
  }, [sumpaymentCompanyData, sumpaymentCompanyError, sumpaymentCompanyLoading]);
  useEffect(() => {
    if (countpaymentCompany?.status === true) {
      setCountPaymenttCompany(countpaymentCompany?.description?.count);
    } else {
    }
  }, [
    countpaymentCompany,
    countpaymentCompanyError,
    countpaymentCompanyLoading,
  ]);

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
              audio?.play();
              console.log(data);
              setPaymentLiveBus((prev) => {
                let arr = prev;
                arr = [data, ...arr];
                console.log("new arr", arr);
                return [...arr];
              });
              if (data?.CompanyID === companyID) {
                setSumPaymenttCompany((prev) => {
                  const num = prev;
                  const sum = parseFloat(data?.value) + num;
                  console.log("sum");
                  console.log(sum);
                  return sum;
                });
                setCountPaymenttCompany((prev) => {
                  const num = prev;
                  const sum = 1 + num;
                  console.log("sum");
                  console.log(sum);
                  return sum;
                });
                parseInt(SumPaymenttCompany?.count + paymentLiveBus.value);
                parseInt(CountPaymenttCompany?.count + 1);
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
      title: "Bus ",
      dataIndex: "palteNumber",
      key: "id",
    },

    {
      title: "Route",
      dataIndex: "routeName",
      key: "id",
    },
    {
      title: "User ",
      dataIndex: "userName",
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
      render: (data) => {
        if (data?.length > 15)
          return (
            <React.Fragment key={data}>
              {data.substring(0, 10)} {data.substring(10, 23)}{" "}
            </React.Fragment>
          );
      },
    },
  ];
  return (
    <div>
      {/* <Row gap={10}>
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
              " rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
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
          <h4>{totalPayment?.toFixed(3)}</h4>
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
          <h4>{totalPaymentToday?.toFixed(3)}</h4>
        </Col>
      </Row> */}
      <Row gutter={(48, 48)}>
        <Col xs={24} sm={24} lg={12} xl={12}>
          <div
            className={style.box_}
            style={{
              background: "#659999",
              background: "-webkit-linear-gradient(to left, #f4791f, #659999)",
              background: " linear-gradient(to left, #f4791f, #659999)",
            }}
          >
            <h2 className={style.title}> Count Payment</h2>
            <div className={style.content}>
              <Row gutter={24}>
                <Col span={24}>
                  <h1
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "20px",
                    }}
                  >
                    {CountPaymenttCompany}
                  </h1>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} lg={12} xl={12}>
          <div
            className={style.box_}
            style={{
              background: "#659999",
              background: "-webkit-linear-gradient(to left, #f4791f, #659999)",
              background: " linear-gradient(to left, #f4791f, #659999)",
            }}
          >
            <h2 className={style.title}>Sum Payments</h2>
            <div className={style.content}>
              <Row gutter={24}>
                <Col span={24}>
                  <h1
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "20px",
                    }}
                  >
                    {SumPaymenttCompany?.toFixed(3)}
                  </h1>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
      <br />
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
  role: state.auth.role,
  companyID: state.auth.companyID,
});

export default connect(mapStateToProps, {})(PaymentCompany);
