import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { SubscripionsType } from "redux/modal/action";
import { SUBSCRIPIONS_TYPE } from "redux/modal/constants";

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

function Subscripions() {
  const dispatch = useDispatch();
  console.log(data);

  return (
    <div>
      <h2>Subscripions</h2>
      {data.map((item) => {
        return (
          <Link
            onClick={() => SubscripionsType(item.name, dispatch)}
            to={`/Subscripions/SubscripionsDetails`}
            className="package"
          >
            <div>
              Name: <strong>{item.name}</strong>
            </div>
            <div>
              Company name: <strong>{item.company}</strong>
            </div>
            <div>
              Duration days: <strong>{item["duration/days"]}</strong>
            </div>
            <div>
              Expiry date: <strong>{item.expiryDate}</strong>
            </div>
            <div>
              Status: <strong>{item.isActive}</strong>
            </div>
            <div>
              Price: <strong>{item.price}</strong>
            </div>
            <div>
              Routes <strong>{item.routes}</strong>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default Subscripions;
