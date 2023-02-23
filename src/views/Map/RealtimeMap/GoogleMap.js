
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLoadScript } from "@react-google-maps/api";
import "./Style.css";

import GoogleMapReact from "google-map-react";
import MyMarker from "./MyMarker";
const NEXT_PUBLIC_MAP_API_KEY = "AIzaSyDJ-2jJpL6Ast3hT88lvUx9S2F5COO0nSM";

const mapOptions = {
  zoom: 13,
  center: {
    lat: 29.357743251785877,
    lng: 47.99079476047599,
  },
};

function GoogleMap({ positions }) {

  console.log("props", positions);

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
        {positions.map(
          (
            { latitude1, longitude1, id, routeName_AR, plateNumber },
            index
          ) => {
            return (
              <MyMarker
                key={index}
                lat={latitude1}
                lng={longitude1}
                routeName={routeName_AR}
                plateNumber={plateNumber}
              />
            );
          }
        )}
      </GoogleMapReact>
    )
  }
}

export default GoogleMap;
