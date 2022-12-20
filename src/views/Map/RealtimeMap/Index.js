import * as signalR from "@microsoft/signalr";
import React, { useCallback, useEffect, useState } from "react";
import { GoogleMapsProvider } from "@ubilabs/google-maps-react-hooks";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import SuperClusterAlgorithm from "./SuperClusterAlgorithm.js";
import data from "./data";
import { NavigationControl } from "mapbox-gl";
import { useSelector } from "react-redux";
const NEXT_PUBLIC_MAP_API_KEY = "AIzaSyDJ-2jJpL6Ast3hT88lvUx9S2F5COO0nSM";

// lat: 29.281596, our location
// lng: 47.9602518,
const mapOptions = {
  zoom: 12,
  center: {
    lat: 43.68,
    lng: -79.43,
  },
};
function Index() {
  const [mapContainer, setMapContainer] = useState();
  const onLoad = useCallback((map) => addMarkers(map), []);
  // const [connection, setConnection] = useState(null);
  const user = useSelector((state) => state.auth);

  // SignalR function not completed
  // useEffect(() => {
  //   const connection = new signalR.HubConnectionBuilder()
  //     .withUrl(process.env.REACT_APP_API_HOST + "chathub",)
  //     .build();
  //   // setConnection(connection)
  //   console.log(connection);

  //   connection.on("ListMapOfBus", function (data) {
  //     console.log(data);
  //   });

  //   connection.start();
  // }, []);

  return (
    <GoogleMapsProvider
      googleMapsAPIKey={NEXT_PUBLIC_MAP_API_KEY}
      mapOptions={mapOptions}
      mapContainer={mapContainer}
      onLoadMap={onLoad}
    >
      <div
        ref={(node) => setMapContainer(node)}
        style={{ height: "100vh" }}
      ></div>
    </GoogleMapsProvider>
  );
}

function addMarkers(map) {
  const infoWindow = new window.google.maps.InfoWindow();

  const markers = data.map(([name, lat, lng, icon]) => {
    const marker = new window.google.maps.Marker({
      position: { lat, lng },
      icon: "http://maps.google.com/mapfiles/dir_6.png",
    }); //  this is the marker that take lng and lat from the main data array

    marker.addListener("click", () => {
      infoWindow.setPosition({ lat, lng });
      infoWindow.setContent(`
      <div className="info">
      <h2>${name}</h2>
      </div>
      `);
      infoWindow.open({ map });
    });

    return marker;
  });

  new MarkerClusterer({
    markers,
    map,
    algorithm: new SuperClusterAlgorithm({ radius: 200 }),
  });
}

export default Index;
