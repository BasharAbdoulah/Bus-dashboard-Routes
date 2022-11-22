import { Empty, Spin } from "antd";
import useFetch from "hooks/useFetch";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { SubscripionsType } from "redux/modal/action";
import { SUBSCRIPIONS_TYPE } from "redux/modal/constants";

const d = new Date();
const currentDate = d.toDateString();

function Companies() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);

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
  console.log(data2);
  return (
    <div className="packages-container">
      <h2>Companies Subscripions</h2>
      {data2?.description.length > 0 ? (
        data2?.description.map((item) => {
          return (
            <Link
              key={item.id}
              to="/Companies/SubscripionsDetails"
              className="package"
              onClick={() => SubscripionsType(item.id, dispatch)}
            >
              {item?.companyName}
            </Link>
          );
        })
      ) : (
        <Spin tip="Loading..." />
      )}
    </div>
  );
}

export default Companies;
