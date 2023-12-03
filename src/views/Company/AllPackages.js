import { PlusCircleFilled } from "@ant-design/icons";
import { message, Modal, Pagination, Spin, Switch, Table } from "antd";
import axios from "axios";
import AddPackage from "Component/Modals/Company/AddPackage";
import useFetch from "hooks/useFetch";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function AllPackages() {
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState([]);
  const user = useSelector((state) => state.auth);
  const [packageData, setPackageData] = useState({});
  const [addModalIs, setAddModalIs] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch(
    "${process.env.REACT_APP_API_HOST}api/ListPackageByCompanyID",
    "post",
    {
      id: user?.companyID,
    },
    true
  );

  useEffect(() => {
    if (true) executeFetch({ PageNumber: currentPage });
  }, []);

  // Handle edit function
  const handleEdit = (item) => {
    setAddModalIs(true);
    setEditMode(true);
    setPackageData({
      companyName: item.companyName,
      desc: item.desc,
      kind: item.kind,
      name: item.name,
      price: item.price,
      id: item.id,
    });
  };

  const compName = data?.description[0].companyName;

  const onAddOk = () => {
    setAddModalIs(false);
    executeFetch();
    setEditMode(false);
  };

  return (
    <>
      {/* Add modal */}
      <Modal
        title="Edit your package"
        centered
        visible={addModalIs}
        // onOk={onAddOk}
        okText="Submit"
        onCancel={() => setAddModalIs(false)}
        footer={null}
      >
        <AddPackage
          onAddOk={onAddOk}
          packageData={packageData}
          editMode={editMode}
        />
      </Modal>
      {/* End add modal */}

      <div className="packages-table-co">
        <div className="add-package-head">
          <p>{compName ? compName : "No"} Packages</p>
          <button
            onClick={() => {
              setAddModalIs(true);
              setEditMode(false);
            }}
          >
            <PlusCircleFilled /> Add Package
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Kind number</th>
              <th>Name </th>
              <th>Price</th>
              <th>Create date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data?.description.map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.desc}</td>
                  <td>{item.kind}</td>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>
                    {item.create_Date.substring(0, 10)}{" "}
                    {item.create_Date.substring(11, 16)}
                  </td>
                  <td>
                    <a onClick={() => handleEdit(item)}>Edit</a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="pagination-container">
          <Pagination
            size={"small"}
            onChange={(e) => setCurrentPage(e)}
            total={tableData?.length}
          />
        </div>
        {loading && (
          <Spin style={{ width: "100%", margin: "20px" }} tip="Loading..." />
        )}
      </div>
    </>
  );
}

export default AllPackages;
