import "./Style.css";
import React, { useState } from "react";
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker,
  InfoWindow,
} from "react-google-maps";

const mapOptions = {
  zoom: 13,
  center: {
    lat: 29.357743251785877,
    lng: 47.99079476047599,
  },
};

const Map = ({ positions }) => {
  const [selectedElement, setSelectedElement] = useState(null);

  const [showInfoWindow, setInfoWindowFlag] = useState(true);

  return (
    <div className="gMapCont">
      <GoogleMap defaultZoom={13} defaultCenter={mapOptions.center}>
        {positions?.map((bus, index) => {
          return (
            <>
              <Marker
                title={bus.plateNumber}
                icon={{
                  // path: google.maps.SymbolPath.CIRCLE,
                  url: require("../../../static/bus-stop.png"),
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
                key={index}
                position={{ lat: bus.latitude2, lng: bus.longitude2 }}
                onClick={() => {
                  setSelectedElement(bus);
                }}
              >
                <p>test</p>
              </Marker>
            </>
          );
        })}

        {/* infowindow */}
        {/* {positions?.map((bus, index) => {
          return (
            <div className="plate-win">
              <InfoWindow
                onCloseClick={false}
                children={<p>test</p>}
                visible={true}
                position={{
                  lat: bus.latitude2,
                  lng: bus.longitude2,
                }}
              >
                <div>
                  <h1>Plate34545 Number: :{selectedElement?.plateNumber}</h1>
                </div>
              </InfoWindow>
            </div>
          );
        })} */}

        {selectedElement ? (
          <InfoWindow
            visible={showInfoWindow}
            position={{
              lat: selectedElement.latitude2,
              lng: selectedElement.longitude2,
            }}
            onCloseClick={() => {
              setSelectedElement(null);
            }}
          >
            <div>
              <h1>Route Name: {selectedElement?.routeName_AR}</h1>
              <h1>Plate Number: :{selectedElement?.plateNumber}</h1>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
};

export default withScriptjs(withGoogleMap(Map));
