import React, { useState } from "react";

const MyMarker = ({ routeName, plateNumber, $hover }) => {
  const [isShow, setIsShow] = useState(false);
  const handleClick = () => {
    setIsShow(!isShow);
  };

  return (
    <div
      className={$hover ? "circle hover" : "circle center"}
      onClick={handleClick}
    >
      <div className="shadow"></div>
      <span className="circleText center" title={routeName}>
        {plateNumber}
      </span>
      {isShow && (
        <div className="info-window center">
          <span>Route number: {routeName}</span>
          <span>Plate number: {plateNumber}</span>
        </div>
      )}
    </div>
  );
};

export default MyMarker;
