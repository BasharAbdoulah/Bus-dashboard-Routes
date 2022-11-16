import "../../styles/global.scss";
import { Spin, Table } from "antd";
import useFetch from "hooks/useFetch";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as signalR from "@microsoft/signalr";
import axios from "axios";
const audio = new Audio("/sounds/pristine-609.mp3");

function OnlinePassengers() {
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState([]);
  const state = useSelector((state) => state.auth);
  const [connection, setConnection] = useState(null);
  const [connectionId, setConnectionId] = useState("");
  const [dataFromLive, setFromLive] = useState([]);
  const [liveCount, setLiveCount] = useState([]);
  const [SumPayment, setSumPayment] = useState({
    type: "Sum_Payment",
    value: 0,
  });

  const { data, error, loading, executeFetch } = useFetch(
    "https://route.click68.com/api/ListPaymentWallet",
    "post",
    {},
    true
  );

  useEffect(() => {
    const protocol = new signalR.JsonHubProtocol();
    const transport = signalR.HttpTransportType.WebSockets;

    const options = {
      transport,
      logMessageContent: true,
      logger: signalR.LogLevel.Trace,
      accessTokenFactory: () => state.token,
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

  if (connection) {
    if (!connection.connectionStarted) {
      console.log("connectionStarted");
      connection
        .start()
        .then((result) => {
          connection.on("RecieveConnectionId", (id) => {
            setConnectionId(id);
          });

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

            dataFromLive.unshift(string);
            setLiveCount([...dataFromLive]);
            console.log("PaymentLive ", dataFromLive);
            // insetData(string)
          });
        })
        .catch((err) => console.error("Failed To Connect", err));
    }
  }

  // useEffect(() => {
  //     setFromLive(data?.description)
  // }, [data])

  console.log(data);

  console.log("data from livee 2", liveCount);

  useEffect(() => {
    // let isFound = tableData.find((d) => d.page === currentPage);
    if (true) executeFetch({ PageNumber: currentPage });
  }, [currentPage]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "userName",
      dataIndex: "userName",
      key: "name",
    },
    {
      title: "Route",
      dataIndex: "routeName",
      key: "routeName",
    },
    {
      title: "value",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "time",
      dataIndex: "time",
      key: "time",
    },
  ];

  console.log("data", data);

  return (
    <div>
      <h2 className="passengers-title on">Online Passengers</h2>
      <h4>
        Number of passengers:
        <strong>{liveCount?.length ? liveCount?.length : 0}</strong>
      </h4>

      <Table
        columns={columns}
        rowKey={"id"}
        pagination={{
          onChange: (page) => {
            setCurrentPage(page);
          },
          total: liveCount?.length,
          current: currentPage,
        }}
        dataSource={liveCount}
        loading={loading}
        size="small"
      />
    </div>
  );
}

export default OnlinePassengers;
