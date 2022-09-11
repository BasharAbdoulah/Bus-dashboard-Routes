import React from "react";
// components
import { Input, Table } from "antd";
// hooks
import useFetch from "hooks/useFetch";

//style
import style from "./style.module.css";
//quary-string
import querySring from "query-string";
const { Search } = Input;
const RouteForStation = () => {
  const onSearch = (value) => console.log(value);
  const { id } = querySring.parse(window.location.search);

  // for table data
  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch(
    "https://route.click68.com/api/ListRouteByStationID",
    "post",
    { id },

    true
  );

  // table columns
  const columns = [
    {
      title: "Area",
      dataIndex: "area",
      key: "area",
    },
    {
      title: "Direction",
      dataIndex: "direction",
      key: "direction",
      render: (data) => {
        if (data == 0) return "Go";
        else if (data == 1) return "Back";
      },
    },
    {
      title: "Route",
      dataIndex: "name_Route",
      key: "name_Route",
    },
    {
      title: "Order",
      dataIndex: "order",
      key: "order",
    },

    // {
    //   title: "Actions",
    //   dataIndex: "id",
    //   key: "id",
    //   render: (data) => {
    //     // return (
    //     //   // <Space size="large" key={data}>
    //     //   //   <a
    //     //   //     href="#"
    //     //   //     onClick={(e) => {
    //     //   //       e.preventDefault();
    //     //   //       handleDeleteItem(data);
    //     //   //     }}
    //     //   //   >
    //     //   //     <DeleteOutlined />
    //     //   //   </a>
    //     //   // </Space>
    //     // );
    //   },
    // },
  ];

  return (
    <div>
      <div className={style.btn}>
        <Search
          placeholder="input search text"
          onSearch={onSearch}
          enterButton
        />
      </div>
      <Table
        columns={columns}
        dataSource={data?.description}
        loading={loading}
        size="small"
      />
    </div>
  );
};

const mapStateToProps = (state) => ({});

export default RouteForStation;
