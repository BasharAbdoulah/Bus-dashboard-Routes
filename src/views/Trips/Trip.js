import React, { useState, useEffect } from "react";
//component
import {CSVLink} from "react-csv"

import { Form, Input, Column } from "antd";
import useFetch from "hooks/useFetch";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { Table } from "ant-table-extensions";
const Trips = () => {
  const onSearch = (value) => console.log(value);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [data1, setData1] = useState([]);
  const fileName = "myfile"; // here enter filename for your excel file


  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch("https://route.click68.com/api/ListTrip", "post",{PageSize: 1000 } );

  useEffect(() => {
    if (data?.status === true && !loading) {
      setData1(data?.description);
     
    }
  }, [data, error, loading]);
  useEffect(() => {
    if (data?.status === true && !loading) {
      // {
      //   page: ,
      //   data: [],
      // }
      let found = false;
      for (let i = 0; i < tableData.length; i++) {
        if (tableData[i].page === currentPage) {
          found = true;
          break;
        }
      }

      if (found === false) {
        setTableData((prev) => {
          let newData = prev;
          newData.push({
            page: currentPage,
            data: data?.description,
          });
          return [...newData];
        });
      }
    }
  }, [data, error, loading]);

  console.log("data");
  console.log(data);
  //table colums
  const columns = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Start Station",
      dataIndex: "startStation",
      key: "startStation",
    },
    {
      title: "End Station",
      dataIndex: "endStation",
      key: "endStation",
    },
    {
      title: "Route ",
      dataIndex: "rout",
      key: "rout",
    },
  ];
  useEffect(() => {
    let isFound = tableData.find((d) => d.page === currentPage);
    if (!isFound) executeFetch({ PageNumber: currentPage });
  }, [currentPage]);

  let tab_data = tableData.find((i) => i.page === currentPage);
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (data1, fileName) => {
    const ws = XLSX.utils.json_to_sheet(data1);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };
  return (
    <div>
        <button onClick={(e) => exportToCSV(data1, fileName)}>Export</button>
        <CSVLink
              filename={"Expense_Table.csv"}
              data={data1}
              className="btn btn-primary"
            >
              Export to CSV
            </CSVLink>
      <Table
        columns={columns}
        rowKey={"id"}
        // pagination={{
        //   onChange: (page) => {
        //     setCurrentPage(page);
        //   },
        //   total: data?.total,
        //   current: currentPage,
        // }}
        dataSource={data?.description}
        loading={loading}
        error={error}
        size="small"
        exportable
      />
    </div>
  );
};
export default Trips;
