import { Spin } from "antd";
import useFetch from "hooks/useFetch";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function SubscriptionsKinds() {
  const user = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const d = new Date();
  const currentDate = d.toDateString();

  const data = [
    {
      id: "1",
      name: "3 Month Pass",
      "duration/days": 90,
      expiryDate: currentDate,
      routes: "all",
      price: 30.0,
      company: "KPTC",
    },
    {
      id: "2",
      name: "Monthly Pass",
      "duration/days": 30,
      expiryDate: currentDate,
      routes: "all",
      price: 12.5,
      company: "KPTC",
    },
    {
      id: "3",
      name: "Weekly Pass",
      "duration/days": 7,
      expiryDate: currentDate,
      routes: "all",
      price: 5.0,
      company: "KPTC",
    },
    {
      id: "4",
      name: "Daily Pass",
      "duration/days": 1,
      expiryDate: currentDate,
      routes: "all",
      price: 0.75,
      company: "KPTC",
      isActive: false,
    },
  ];

  const {
    data: data2 = [],
    error,
    loading,
    executeFetch,
  } = useFetch(
    "https://route.click68.com/api/ListCompany",
    "post",
    {},
    true,
    {},
    user?.token
  );

  return (
    <div className="packages-container">
      <h2> Subscripions</h2>
      {data.length > 0 ? (
        data.map((item) => {
          return (
            <Link
              key={item.id}
              to={`/SubscriptionsByKind?name=${item.name}`}
              className="package"
              //   onClick={() => SubscripionsType(item.id, dispatch)}
            >
              <p>Name: {item?.name}</p>
              <p>Price: {item?.price}</p>
              <p>Routes: {item?.routes}</p>
            </Link>
          );
        })
      ) : (
        <Spin tip="Loading..." />
      )}
    </div>
  );
}

export default SubscriptionsKinds;
