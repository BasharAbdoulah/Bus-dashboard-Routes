import * as signalR from "@microsoft/signalr";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLoadScript } from "@react-google-maps/api";
import "./Style.css";

import GoogleMapReact from "google-map-react";
import MyMarker from "./MyMarker";
const NEXT_PUBLIC_MAP_API_KEY = "AIzaSyDJ-2jJpL6Ast3hT88lvUx9S2F5COO0nSM";

// lat: 29.281596, our location
// lng: 47.9602518,
// 29.357743251785877, 47.99079476047599;
const mapOptions = {
  zoom: 13,
  center: {
    lat: 29.357743251785877,
    lng: 47.99079476047599,
  },
};

function Index() {
  const [paymentLiveBus, setPaymentLiveBus] = useState([]);

  const user = useSelector((state) => state.auth);
  const [connection, setConnection] = useState(null);
  const [connectionId, setConnectionId] = useState("");

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
      .build();
    setConnection(newConnection);
    return () => {};
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
            console.log("new arsdfsdfgasfgsdgr");
            connection.invoke("GetListBusMap");
            connection.on("ListBusMap", (data) => {
              setPaymentLiveBus((prev) => {
                let arr = prev;
                arr.push(...data);
                console.log("new aaaaà22äarr", arr);
                return [...arr];
              });
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

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: NEXT_PUBLIC_MAP_API_KEY,
  });

  const distanceToMouse = (pt, mp) => {
    if (pt && mp) {
      // return distance between the marker and mouse pointer
      return Math.sqrt(
        (pt.x - mp.x) * (pt.x - mp.x) + (pt.y - mp.y) * (pt.y - mp.y)
      );
    }
  };

  if (!isLoaded) return <div>Loading...</div>;
  return <Map />;

  function Map() {
    return (
      <GoogleMapReact
        bootstrapURLKeys={{
          key: NEXT_PUBLIC_MAP_API_KEY,
          language: "en",
        }}
        defaultCenter={mapOptions.center}
        defaultZoom={mapOptions.zoom}
        distanceToMouse={distanceToMouse}
      >
        {paymentLiveBus.map(
          ({ latitude1, longitude1, id, routeName_AR, plateNumber }, index) => {
            return (
              <MyMarker
                key={id}
                lat={latitude1}
                lng={longitude1}
                routeName={routeName_AR}
                plateNumber={plateNumber}
              />
            );
          }
        )}
      </GoogleMapReact>
    );
  }
}

export default Index;
