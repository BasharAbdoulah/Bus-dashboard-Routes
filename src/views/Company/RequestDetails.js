import React, { useEffect, useState } from "react";
// components
import { Table } from "antd";
// hooks
import useFetch from "hooks/useFetch";
import style from "./style.module.css";
//quary-string
import querySring from "query-string";
const RequestDetails = () => {
  const { id } = querySring.parse(window.location.search);
  const [detail, setDetail] = useState([]);
  // for table data
  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch(
    "https://route.click68.com/api/GetRouteRequest",
    "post",
    { id },

    true
  );
  useEffect(() => {
    if (data?.status === true) {
      setDetail(data?.description);
    } else {
    }
  }, [data, error, loading]);
  // table columns

  return (
    <div>
      <table className={style.table}>
        <tr className={style.tr}>
          <th className={style.th}>Admin</th>
          <th className={style.th}>Company</th>
          <th className={style.th}>Area EN</th>
          <th className={style.th}>Name EN</th>
          <th className={style.th}>Price </th>
          <th className={style.th}>Request Date </th>
        </tr>
        <tr className={style.tr}>
          <td className={style.td}>{detail.admin} </td>
          <td className={style.td}> {detail.company} </td>
          <td className={style.td}> {detail.area_EN} </td>
          <td className={style.td}> {detail.name_EN} </td>
          <td className={style.td}> {detail.price} </td>
          <td> {detail.request_Date} </td>
        </tr>
      </table>
    </div>
  );
};

export default RequestDetails;
