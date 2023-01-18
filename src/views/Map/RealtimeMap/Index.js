import * as signalR from "@microsoft/signalr";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { GoogleMap, InfoWindow, Marker, useLoadScript } from "@react-google-maps/api";
const NEXT_PUBLIC_MAP_API_KEY = "AIzaSyDJ-2jJpL6Ast3hT88lvUx9S2F5COO0nSM";

// lat: 29.281596, our location
// lng: 47.9602518,
const mapOptions = {
  zoom: 12,
  center: {
    lat: 29.281596,
    lng: 47.9602518,
  },
};
function Index() {

  const [paymentLiveBus, setPaymentLiveBus] = useState([]);
  const [mapContainer2, setMapContainer] = useState();
  const map = useRef(null);
  const mapContainer = useRef(null);
  const user = useSelector((state) => state.auth)
  const [connection, setConnection] = useState(null);
  const [connectionId, setConnectionId] = useState("");
  const [selectedMarker, setSelectedMarker] = useState({busID: "",lat: "", lng: "",routeName_EN:"",plateNumber:""});

  
  
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
            connection.invoke('GetListBusMap')
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

  if (!isLoaded) return <div>Loading...</div>;
  return <Map />;

  function Map() {
    const center = useMemo(() => ({ lat: 44, lng: -80 }), []);
  
    return (
      <GoogleMap zoom={mapOptions.zoom} center={mapOptions.center} mapContainerClassName="map-container">
        {paymentLiveBus?.map(({latitude1,longitude1, busID ,plateNumber,routeName_EN}, index) => {
          return (
            <Marker  key={index} position={{lat: latitude1, lng: longitude1}} options={
              {
                icon: "http://maps.google.com/mapfiles/dir_6.png"
              }
            } onClick={() => {
              setSelectedMarker({busID: busID, lat: latitude1, lng: longitude1,plateNumber:plateNumber ,routeName_EN:routeName_EN})
        
            }} />
          )
        } )}
          {selectedMarker.busID &&  <InfoWindow position={{lat: selectedMarker?.lat, lng: selectedMarker?.lng }}>
          <h2>Route :{selectedMarker?.routeName_EN}{""} {""}Plate Number:{selectedMarker?.plateNumber}</h2>
        
        </InfoWindow>} 
      </GoogleMap>
      
    );
  }
}

 


export default Index;
