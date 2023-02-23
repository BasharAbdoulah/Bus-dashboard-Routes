import * as signalR from "@microsoft/signalr";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import GoogleMap from "./GoogleMap";

import "./Style.css";




// lat: 29.281596, our location
// lng: 47.9602518,
// 29.357743251785877, 47.99079476047599;


function Index() {
  const [paymentLiveBus, setPaymentLiveBus] = useState([]);

  const user = useSelector((state) => state.auth);
  const [connection, setConnection] = useState(null);
  const [connectionId, setConnectionId] = useState("");
  const [count, setCount] = useState(1);


  useEffect(() => {
    const protocol = new signalR.JsonHubProtocol();
    const transport = signalR.HttpTransportType.WebSockets;

    const options = {
      transport,
      logMessageContent: true,
      logger: signalR.LogLevel.Trace,
      accessTokenFactory: () => user?.token,
    };

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(
        process.env.REACT_APP_API_HOST + "chathub",
        options /*{ jwtBearer: token }*/
      )
      .withHubProtocol(protocol)
      .withAutomaticReconnect()
      .build();
    setConnection(newConnection);
    return () => { };
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
          })
          .catch((err) => console.error("Failed To Connect", err))
      }
    }

    console.log("connection is run");
  }, [connection]);

  useEffect(() => {

    const interval = setInterval(() => {
      console.log("re");
      connection?.invoke("GetListBusMap");
      connection?.on("ListBusMap", (data) => {

        if (JSON.stringify(data) !== JSON.stringify(paymentLiveBus)) {
          setPaymentLiveBus(data);
        }

      });
    }, 5000);
    return () => clearInterval(interval);
  }, [connection]);

  return (
    <>
      <GoogleMap positions={paymentLiveBus} />
    </>
  );

}

export default Index
