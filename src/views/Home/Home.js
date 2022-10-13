import React, { useEffect, useState, useCallback } from "react";
// components
import { Col, Row, List, Avatar, Table } from "antd";
import * as signalR from "@microsoft/signalr";
import useSound from "use-sound";
import PaymentOfCompany from "views/Company/PaymentOfCompany";

// hooks
import useFetch from "hooks/useFetch";
import { Pie } from "@ant-design/plots";
// styles
import style from "./style.module.css";
import { FaRoute } from "react-icons/fa";
import { notification } from "antd";
import { connect, useDispatch } from "react-redux";
import axios from "axios";
import ReactAudioPlayer from "react-audio-player";
import { panelPaymentValue } from "redux/modal/action";
import { PANEL_PAYMENTS_VALUE } from "redux/modal/constants";
const audio = new Audio("/sounds/pristine-609.mp3");

const Home = ({ token, role, companyID }) => {
  const [connection, setConnection] = useState(null);
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("welcome");
  const [messages, setMessages] = useState([]);
  const [connectionId, setConnectionId] = useState("");
  const [popoverShow, setPopoverShow] = useState(false);
  const [paymentLiveBus, setPaymentLiveBus] = useState([]);
  const [play] = useSound("/sounds/guitar-loop.mp3", { volume: 2.25 });
  const dispatch = useDispatch();

  // const [play] = useSound(beep, { interrupt: true });

  // const openNotification = useCallback((message) => {
  //   <ReactAudioPlayer src="my_audio_file.ogg" autoPlay controls />;

  //   notification.open({
  //     message: "Notification Title",
  //     description: message,
  //     onClick: () => {
  //       console.log("Notification Clicked!");
  //     },
  //   });
  // }, []);
  const [tripCount, setTripCount] = useState({
    type: "trip",
    value: 0,
  });
  const [CountCharge, setCountCharge] = useState({
    type: "charge",
    value: 0,
  });

  const [CountPayment, setCountPayment] = useState({
    type: "Payment",
    value: 0,
  });
  const [SumPayment, setSumPayment] = useState({
    type: "Sum_Payment",
    value: 0,
  });
  const [SumCharge, setSumCharge] = useState({
    type: "Sum_Charge",
    value: 0,
  });
  const [SumPaymenttCompany, setSumPaymenttCompany] = useState(0);
  const [CountPaymenttCompany, setCountPaymenttCompany] = useState(0);

  // count of route

  const {
    data = {},
    error,
    loading,
    executeFetch,
  } = useFetch(
    "https://route.click68.com/api/CountRoute",
    "get",
    {},
    role?.includes("superAdmin") || role?.includes("admin") ? true : false,
    {},
    token
  );
  // count of station
  const {
    data: stationData = {},
    error: stationError,
    loading: stationLoading,
    StationexecuteFetch,
  } = useFetch(
    "https://route.click68.com/api/CountStation",
    "get",
    {},
    role?.includes("superAdmin") || role?.includes("admin") ? true : false,
    {},
    token
  );

  // const {
  //   data: paymentData = {},
  //   error: paymentDataError,
  //   loading: paymentDataLoading,
  //   PaymentDataexecuteFetch,
  // } = useFetch(
  //   "https://route.click68.com/api/company/PaymentByCompany",
  //   "post",
  //   { PageSize: 1000 },
  //   true,
  //   {},
  //   token
  // );
  // const {
  //   data: sumpaymentCompanyData = {},
  //   error: sumpaymentCompanyError,
  //   loading: sumpaymentCompanyLoading,
  //   SumpaymentCompanyexecuteFetch,
  // } = useFetch(
  //   "https://route.click68.com/api/SumPaymentByCompany",
  //   "get",
  //   {},
  //   role?.includes("Company") ? true : false,
  //   {},
  //   token
  // );
  // const {
  //   data: countpaymentCompany = {},
  //   error: countpaymentCompanyError,
  //   loading: countpaymentCompanyLoading,
  //   CountpaymentCompanyexecuteFetch,
  // } = useFetch(
  //   "https://route.click68.com/api/CountPaymentByCompany",
  //   "get",
  //   {},
  //   role?.includes("Company") ? true : false,
  //   {},
  //   token
  // );

  // count of station
  const {
    data: stationRouteData = {},
    error: stationRouteError,
    loading: stationRouteLoading,
    RouteStationexecuteFetch,
  } = useFetch(
    "https://route.click68.com/api/CountRouteStation",
    "get",
    {},
    role?.includes("superAdmin") || role?.includes("admin") ? true : false,
    {},
    token
  );
  // useEffect(() => {
  //   if (paymentData?.status === true) {
  //     setPaymentLiveBus(paymentData?.description);
  //   } else {
  //   }
  // }, [paymentData, paymentDataError, paymentDataLoading]);
  // useEffect(() => {
  //   if (sumpaymentCompanyData?.status === true) {
  //     setSumPaymenttCompany(sumpaymentCompanyData?.description?.count);
  //   } else {
  //   }
  // }, [sumpaymentCompanyData, sumpaymentCompanyError, sumpaymentCompanyLoading]);
  // useEffect(() => {
  //   if (countpaymentCompany?.status === true) {
  //     setCountPaymenttCompany(countpaymentCompany?.description?.count);
  //   } else {
  //   }
  // }, [
  //   countpaymentCompany,
  //   countpaymentCompanyError,
  //   countpaymentCompanyLoading,
  // ]);

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
    const getData = async () => {
      const { data: CountPaymentData } = await axios.get(
        "https://route.click68.com/api/CountPayment",

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { data: CountChargeData } = await axios.get(
        "https://route.click68.com/api/CountCharge",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { data: CountTripData } = await axios.get(
        "https://route.click68.com/api/CountTrip",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { data: SumPaymentData } = await axios.get(
        "https://route.click68.com/api/SumPaymentWallet",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { data: SumChargetData } = await axios.get(
        "https://route.click68.com/api/SumChargeWallet",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },

        false
      );

      setCountPayment({
        ...CountPayment,
        value: parseInt(CountPaymentData.description.count),
      });

      setCountCharge({
        ...CountCharge,
        value: parseInt(CountChargeData.description.count),
      });
      setTripCount({
        ...tripCount,
        value: parseInt(CountTripData.description.count),
      });
      setSumPayment({
        ...SumPayment,
        value: parseFloat(SumPaymentData.description).toFixed(3),
      });
      setSumCharge({
        ...SumCharge,
        value: parseFloat(SumChargetData.description).toFixed(3),
      });
    };
    console.log("ddgdgd");
    console.log("ddgdgd");
    getData();
  }, []);

  useEffect(() => {
    // window.addEventListener("click", overlayClick) PaymentLive;
    if (connection) {
      if (!connection.connectionStarted) {
        connection
          .start()
          .then((result) => {
            connection.on("RecieveConnectionId", (id) => {
              setConnectionId(id);
            });

            connection.on("TripCount", (string) => {
              console.log("1212 string");
              console.log(string);
              audio?.play();
              setTripCount({
                ...tripCount,
                value: parseInt(string),
              });
            });
            connection.on("ChargeCount", (string) => {
              audio?.play();
              console.log("11string");
              console.log(string);
              setCountCharge({
                ...CountCharge,
                value: parseInt(string),
              });
            });
            connection.on("PaymentCount", (string) => {
              audio?.play();
              console.log("11string");
              console.log(string);
              setCountPayment({
                ...CountPayment,
                value: parseInt(string),
              });
            });
            connection.on("ChargeValueCount", (string) => {
              audio?.play();
              console.log("11string");
              console.log(string);
              setSumCharge({
                ...SumCharge,
                value: parseFloat(string).toFixed(3),
              });
            });
            // connection.on("PaymentLiveBus", (paymentData) => {
            //   play();
            //   console.log("paymentData");
            //   console.log(paymentData);

            //   setPaymentLiveBus((prev) => {
            //     let arr = prev;
            //     arr = [data, ...arr];
            //     console.log("new arr", arr);
            //     return [...arr];
            //   });
            //   console.log(paymentData);
            //   if (paymentData?.CompanyID === companyID) {
            //     setSumPaymenttCompany((prev) => {
            //       const num = prev;
            //       const sum = parseFloat(paymentData?.value) + num;
            //       console.log("sum");
            //       console.log(sum);
            //       return sum;
            //     });
            //     setCountPaymenttCompany((prev) => {
            //       const num = prev;
            //       const sum = 1 + num;
            //       console.log("sum");
            //       console.log(sum);
            //       return sum;
            //     });
            //     parseInt(SumPaymenttCompany?.count + paymentLiveBus.value);
            //     parseInt(CountPaymenttCompany?.count + 1);
            //   }
            // });
            connection.on("PaymentValueCount", (string) => {
              audio?.play();
              console.log("string");
              console.log(string);
              setSumPayment({
                ...SumPayment,
                value: parseFloat(string).toFixed(3),
              });
            });

            connection.on("PaymentLive", (string) => {
              audio?.play();
              console.log("PaymentLive string");
              console.log(string);
            });
          })
          .catch((err) => console.error("Failed To Connect", err));
      }
    }
    // else {
    //   console.log("remove event listener");
    //   window.removeEventListener("click", overlayClick);
    // }
    console.log("connection is run");
  }, [connection]);

  console.log("[tripCount, CountCharge, CountPayment]");
  console.log([tripCount, CountCharge, CountPayment]);

  let config = {
    appendPadding: 10,
    data: [CountCharge, CountPayment, SumCharge, SumPayment, tripCount],
    angleField: "value",
    colorField: "type",
    radius: 0.9,
    label: {
      type: "inner",
      offset: "-30%",
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: "center",
      },
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
  };
  console.log("Sum", SumPayment);

  const columns = [
    {
      title: "Palte Number ",
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
      title: "Date ",
      dataIndex: "date",
      key: "id",
      render: (data) => {
        if (data?.length > 20)
          return (
            <React.Fragment key={data}>
              {data.substring(0, 10)} {data.substring(11, 16)}{" "}
            </React.Fragment>
          );
      },
    },
    // {
    //   title: "Date",
    //   dataIndex: "date",
    //   key: "id",
    // },
  ];
  return (
    <div>
      <div className={style.home_dash}>
        <>
          <div className={style.header}>
            {role?.includes("Company") ? (
              <>
                <PaymentOfCompany />
                {/* <Row gutter={(48, 48)}>
                  <Col xs={24} sm={24} lg={12} xl={12}>
                    <div
                      className={style.box_}
                      style={{
                        background: "#659999",
                        background:
                          "-webkit-linear-gradient(to left, #f4791f, #659999)",
                        background:
                          " linear-gradient(to left, #f4791f, #659999)",
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
                        background:
                          "-webkit-linear-gradient(to left, #f4791f, #659999)",
                        background:
                          " linear-gradient(to left, #f4791f, #659999)",
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
                <Table
                  columns={columns}
                  dataSource={paymentLiveBus}
                  loading={paymentDataLoading}
                  size="small"
                  rowKey={"id"}
                /> */}
              </>
            ) : (
              <>
                <Row gutter={(48, 48)}>
                  <Col xs={24} sm={24} lg={12} xl={8}>
                    <div className={style.box_}>
                      <h2 className={style.title}>Route</h2>
                      <div className={style.content}>
                        <Row gutter={24}>
                          <Col span={12}>
                            <h3>The Numbers Of All Route</h3>
                          </Col>
                          <Col span={12}>
                            <span>{data?.description.count}</span>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={24} lg={12} xl={8}>
                    <div className={style.box_}>
                      <h2 className={style.title}>Station</h2>
                      <div className={style.content}>
                        <Row gutter={24}>
                          <Col span={12}>
                            <h3>The Numbers Of All Station</h3>
                          </Col>
                          <Col span={12}>
                            <span>{stationData?.description.count}</span>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={24} lg={12} xl={8}>
                    <div className={style.box_}>
                      <h2 className={style.title}>Trips</h2>
                      <div className={style.content}>
                        <Row gutter={24}>
                          <Col span={12}>
                            <h3>The Numbers Of All Trips</h3>
                          </Col>
                          <Col span={12}>
                            <span> {tripCount.value}</span>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={24} lg={12} xl={8}>
                    <div className={style.box_}>
                      <h2 className={style.title}>RouteStation</h2>
                      <div className={style.content}>
                        <Row gutter={24}>
                          <Col span={12}>
                            <h3>The Numbers Of All Routestation</h3>
                          </Col>
                          <Col span={12}>
                            <span>{stationRouteData?.description.count}</span>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Col>

                  <Col xs={24} sm={24} lg={12} xl={8}>
                    <div
                      className={style.box_}
                      style={{
                        background: "#659999",
                        background:
                          "-webkit-linear-gradient(to left, #f4791f, #659999)",
                        background:
                          " linear-gradient(to left, #f4791f, #659999)",
                      }}
                    >
                      <h2 className={style.title}>Charge wallet</h2>
                      <div className={style.content}>
                        <Row gutter={24}>
                          <Col span={12}>
                            <h3>The Numbers Of All Charge</h3>
                            <span> {SumCharge.value}</span>
                          </Col>

                          <Col span={12}>
                            <h3
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {CountCharge.value}
                            </h3>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={24} lg={12} xl={8}>
                    <div
                      className={style.box_}
                      style={{
                        background: "#659999",
                        background:
                          "-webkit-linear-gradient(to left, #f4791f, #659999)",
                        background:
                          " linear-gradient(to left, #f4791f, #659999)",
                      }}
                    >
                      <h2 className={style.title}>Payments</h2>
                      <div className={style.content}>
                        <Row gutter={24}>
                          <Col span={12}>
                            <h3>The Numbers Of All Payments</h3>
                            <span>{SumPayment.value}</span>
                          </Col>
                          <Col span={12}>
                            <h3
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {CountPayment.value}
                            </h3>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Col>

                  <Col xs={24} sm={24} lg={12} xl={12}>
                    <Pie {...config} />
                  </Col>
                </Row>
              </>
            )}
          </div>
        </>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  token: state.auth.token,
  role: state.auth.role,
  companyID: state.auth.companyID,
});

export default connect(mapStateToProps, {})(Home);
